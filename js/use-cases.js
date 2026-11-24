(function () {
  "use strict";

  const tabList = document.getElementById("case-tabs");
  const tabs = Array.from(tabList.querySelectorAll("a"));
  const panels = tabs.map((tab) => document.getElementById(tab.hash.slice(1)));

  function selectTab(index) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
  }

  function selectFromLocation() {
    const hash = location.hash.slice(1);
    const target = document.getElementById(hash);
    const index = panels.findIndex((panel) => panel.contains(target));
    selectTab(Math.max(0, index));
  }

  function activateTab(index) {
    selectTab(index);
    const hash = tabs[index].hash;
    if (hash !== location.hash) history.pushState(null, "", hash);
  }

  tabList.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    const panel = panels[index];
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;

    tab.addEventListener("click", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      activateTab(index);
    });
    tab.addEventListener("keydown", (event) => {
      const nextIndex = {
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
        " ": index,
      }[event.key];
      if (nextIndex === undefined) return;
      event.preventDefault();
      activateTab(nextIndex);
      tabs[nextIndex].focus();
    });
  });

  selectFromLocation();
  addEventListener("popstate", selectFromLocation);
  addEventListener("hashchange", selectFromLocation);
})();
