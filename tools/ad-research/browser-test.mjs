// Run from the repository root: node tools/ad-research/browser-test.mjs
// Install Playwright and Chromium first. All external requests are intercepted.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('.');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    const path = resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
    if (!path.startsWith(root+sep)) { res.writeHead(403).end(); return; }
    const content = await readFile(path);
    res.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream'}).end(content);
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const origin = 'http://127.0.0.1:'+server.address().port;
let browser;
try {
  browser = await chromium.launch({headless:true});
  for (const viewport of [{width:1280,height:900},{width:390,height:844}]) {
    const context = await browser.newContext({viewport});
    let loads=0, submissions=0, responseStatus=200, lastPayload='';
    await context.route('**/*', async route => {
      const url=new URL(route.request().url());
      if(url.origin===origin) return route.continue();
      if(url.href==='https://bzrcdn.openai.com/sdk/oaiq.min.js') {
        loads++;
        return route.fulfill({contentType:'text/javascript',body:
          'window.__testEvents=[]; const queued=window.oaiq.q; window.oaiq=(...args)=>window.__testEvents.push(args); for(const args of queued) window.oaiq(...args);'});
      }
      if(url.origin==='https://formspree.io') {
        if(route.request().method()==='OPTIONS') return route.fulfill({status:204,headers:{'access-control-allow-origin':origin,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type, accept'}});
        submissions++;
        lastPayload=route.request().postData() || '';
        return route.fulfill({status:responseStatus,contentType:'application/json',headers:{'access-control-allow-origin':origin},body:JSON.stringify({ok:responseStatus===200})});
      }
      return route.abort();
    });
    const page=await context.newPage();
    const count=async name=>page.evaluate(n=>(window.__testEvents||[]).filter(a=>a[0]==='measure'&&a[1]===n).length,name);
    const click=async id=>page.locator('#'+id).click();
    const form=page.locator('#contact-form');
    async function submit() {
      await form.locator('[name=name]').fill('Synthetic QA');
      await form.locator('[name=email]').fill('qa@example.invalid');
      await form.locator('[name=message]').fill('Synthetic test inquiry; not a real lead.');
      await form.locator('[name=consent]').check();
      await form.locator('button[type=submit]').click();
      await page.waitForFunction(()=>!document.querySelector('#contact-form button[type=submit]').disabled);
    }
    await page.goto(origin);
    await page.locator('#measurement-panel').waitFor({state:'visible'});
    assert.equal(loads,0,'SDK must not load before consent');
    await click('measurement-decline');
    await page.reload();
    assert.equal(loads,0,'Decline persists');
    assert.equal(await page.locator('#measurement-panel').isVisible(),false);
    await submit();
    assert.equal(submissions,1,'Form works without ad consent');
    assert.equal(await count('lead_created'),0);
    await click('measurement-settings');
    await click('measurement-accept');
    await page.waitForFunction(()=>window.__testEvents?.some(a=>a[1]==='page_viewed'));
    assert.equal(loads,1);
    assert.equal(await count('page_viewed'),1);
    responseStatus=400;
    await submit();
    assert.equal(await count('lead_created'),0,'Failed request must not be counted');
    responseStatus=200;
    await submit();
    assert.equal(await count('lead_created'),1,'Successful request is counted exactly once');
    await click('measurement-settings');
    await click('measurement-decline');
    await submit();
    assert.equal(await count('lead_created'),1,'Withdrawal suppresses further events');
    await page.reload();
    assert.equal(loads,1,'No SDK reload after withdrawal');
    assert.equal(await count('lead_created'),0);
    assert.equal(await page.locator('#measurement-settings').isVisible(),true);
    assert.equal(await page.locator('#showcase').count(),0,'Homepage must not contain research showcase');
    assert.equal(await page.locator('.pillar-grid a').count(),4);
    for (const [slug,title] of [['market-research','Market Research'],['ai-advertising','AI Advertising'],['ai-consulting','AI Consulting'],['ai-training','AI Training']]) {
      await page.goto(origin);
      await page.locator('.pillar-grid a[href="'+slug+'.html"]').click();
      assert.equal(new URL(page.url()).pathname,'/'+slug+'.html');
      assert.equal(await page.locator('.nav-links a[aria-current="page"]').textContent(),title);
      assert.equal(await page.locator('.nav-links a[href="use-cases.html"]').count(),1);
      assert.equal(await page.locator('#showcase').count(),slug==='market-research'?1:0);
      assert.equal(await page.locator('#get-a-quote').count(),1);
      assert.equal(await form.locator('[name=service]').inputValue(),title);
      assert.equal(await form.locator('[name=request_type]').inputValue(),'Quote request');
      const beforeLoads=loads, beforeSubmissions=submissions;
      await submit();
      assert.equal(submissions,beforeSubmissions+1,'Quote form works with measurement declined');
      assert.equal(loads,beforeLoads,'Decline persists across pages');
      assert.ok(lastPayload.includes('name="service"')&&lastPayload.includes(title),'Quote payload identifies service');
      assert.ok(lastPayload.includes('name="request_type"')&&lastPayload.includes('Quote request'));
      assert.equal(await form.locator('button[type=submit] span').textContent(),'Request a quote');
      await click('measurement-settings');
      await click('measurement-accept');
      await page.waitForFunction(()=>window.__testEvents?.some(a=>a[1]==='page_viewed'));
      assert.equal(await count('page_viewed'),1);
      responseStatus=400;
      await submit();
      assert.equal(await count('lead_created'),0);
      responseStatus=200;
      await submit();
      assert.equal(await count('lead_created'),1,'One conversion per accepted quote');
      await click('measurement-settings');
      await click('measurement-decline');
      await submit();
      assert.equal(await count('lead_created'),1);
    }
    await page.goto(origin+'/?qa=1#showcase');
    await page.waitForURL('**/market-research.html?qa=1#showcase');
    assert.equal(await page.locator('#showcase').count(),1);
    await page.goto(origin);
    if (viewport.width <= 860) await click('menu-btn');
    await page.getByRole('link', {name:'Use Cases'}).click();
    await page.locator('#verdict .pill').first().waitFor();
    assert.equal(new URL(page.url()).pathname,'/use-cases.html');
    assert.equal(await page.locator('.nav-links a[aria-current="page"]').textContent(),'Use Cases');
    assert.equal(await page.locator('#verdict .pill').count(),6);
    assert.equal(await page.locator('#hm tr[data-i]').count(),45);
    const baseline = await page.locator('#verdict').textContent();
    await page.getByRole('button', {name:'Access-led'}).click();
    assert.notEqual(await page.locator('#verdict').textContent(),baseline);
    assert.equal(await page.locator('#w-LE').inputValue(),'40');
    await page.getByRole('slider', {name:'Legal'}).press('Home');
    assert.equal(await page.locator('#rob').getByRole('columnheader', {name:'Your weights'}).count(),1);
    const minMax = await page.locator('#verdict').textContent();
    await click('m-t');
    assert.equal(await page.locator('#m-t').getAttribute('aria-pressed'),'true');
    assert.notEqual(await page.locator('#verdict').textContent(),minMax);
    await page.locator('#bars rect[data-c="1"]').press('Enter');
    assert.match(await page.locator('#t-drv').textContent(),/Brazil/);
    await page.locator('#hm td[data-i="0"]').first().press('Enter');
    assert.match(await page.locator('#detail .ctitle').textContent(),/Political stability/);
    await page.getByText('Show as table').click();
    assert.equal(await page.locator('#bartable tbody tr:visible').count(),6);
    assert.equal(await page.locator('.scorecard').evaluate(node => node.scrollWidth <= node.clientWidth),true);
    assert.equal(await page.getByRole('link', {name:'Request a market research quote'}).getAttribute('href'),'market-research.html#get-a-quote');
    await context.close();
    console.log('PASS mock SDK/form browser acceptance '+viewport.width+'px');
  }
} finally {
  await browser?.close();
  await new Promise(r=>server.close(r));
}
