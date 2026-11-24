# Advertising measurement release checklist

Do not merge to production until the privacy notice placeholders are resolved and the SDK behavior has been verified. The homepage loads the OpenAI SDK only after an affirmative choice. The public pixel identifier is configured in `js/ad-measurement.js`; no API secrets belong in this repository. Debug is disabled by default.

## Browser acceptance tests

1. Serve a checkout of this branch locally or on an approved preview host. Use a clean browser profile. With DevTools Network open, verify no OpenAI SDK or measurement request before choosing Allow; confirm Decline persists after reload.
2. Choose Allow; verify the SDK loads, inspect requests and CSP errors, and confirm the page-view event arrives in Ads Manager. Verify the actual payload contains no contact form fields or unintended automatic matching; review platform settings and disable unnecessary matching before release. Confirm actual cookie names, scopes and lifetimes against the SDK and privacy notice.
3. Test the form with a mocked successful Formspree response before sending any real inquiry. Confirm one lead event per successful response; no event on validation failure, honeypot, non-success HTTP status or rejected request. Confirm the contact form still works without consent and when the SDK fails to load.
4. Withdraw via Advertising privacy settings. Confirm no subsequent measurement events, including after reload, and inspect cookies and local storage. Verify a second tab also respects the withdrawal. Test keyboard navigation, mobile layout and light/dark themes.
5. Review the OpenAI data terms and complete the privacy and legal pages with the business owner. Obtain approval for the disclosure and SDK configuration. Merge only after acceptance tests pass.
6. On the production domain, repeat the consent and conversion tests using the Ads Manager data source diagnostics. Use a clearly marked synthetic test inquiry. Check the exact event names in Ads Manager and select the successful inquiry as the lead conversion. No campaign or media expenditure is initiated by this integration.

## Rollback

Revert the measurement commits or remove the `js/ad-measurement.js` script inclusion and the OpenAI CSP allowances. Restore the privacy notice to reflect actual behavior. Confirm no SDK requests remain.
