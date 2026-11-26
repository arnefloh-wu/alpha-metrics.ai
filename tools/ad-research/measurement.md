# Advertising measurement release checklist

The visitor-facing privacy wording is complete. Do not activate production measurement until the remaining provider arrangements and actual SDK behavior have been verified. The homepage loads the OpenAI SDK only after an affirmative choice. The public pixel identifier is configured in `js/ad-measurement.js`; no API secrets belong in this repository. Debug is disabled by default.

## Outstanding release checks

- Confirm the applicable provider terms and international transfer mechanisms for the actual account configurations; retain the evidence privately.
- Before switching form providers, obtain and retain the account-specific Form.taxi Article 28 agreement, and verify subprocessors, retention, and delivery to the approved inbox. Leave any former provider archive unchanged until separately reviewed.
- Confirm conversion-data retention criteria with OpenAI if needed, and verify the actual Pixel payload and matching behavior against the notice. Do not equate cookie lifetime with server-side retention.
- Review the current consumer email service separately; no processor DPA is available for that product. Deferral is not confirmation of compliance.
- Confirm a practical deletion process for enquiry records in the mailbox and form service. Have the business owner review the final wording and operational safeguards before activation.

## Browser acceptance tests

1. Serve a checkout of this branch locally or on an approved preview host. Use a clean browser profile. With DevTools Network open, verify no OpenAI SDK or measurement request before choosing Allow; confirm Decline persists after reload.
2. Choose Allow; verify the SDK loads, inspect requests and CSP errors, and confirm the page-view event arrives in Ads Manager. Verify the actual payload contains no contact form fields or unintended automatic matching; review automatic advanced matching (enabled for Austrian Web Pixels and not documented as optional there). Obtain approval for that processing or choose a different measurement approach before release. Confirm actual cookie names, scopes and lifetimes against the SDK and privacy notice. Official reference: https://developers.openai.com/ads/measurement-pixel .
3. Test the form with a mocked successful Form.taxi response before sending any real inquiry. Confirm one lead event per successful response; no event on validation failure, honeypot, non-success HTTP status, invalid JSON, provider rejection, or rejected request. Confirm the contact form still works without consent and when the SDK fails to load.
4. Withdraw via Advertising privacy settings. Confirm no subsequent measurement events, including after reload, and inspect cookies and local storage. Verify a second tab also respects the withdrawal. Test keyboard navigation, mobile layout and light/dark themes.
5. Review the OpenAI data terms and complete the privacy and legal pages with the business owner. Obtain approval for the disclosure and SDK configuration. Merge only after acceptance tests pass.
6. On the production domain, repeat the consent and conversion tests using the Ads Manager data source diagnostics. Use a clearly marked synthetic test inquiry. Check the exact event names in Ads Manager and select the successful inquiry as the lead conversion. No campaign or media expenditure is initiated by this integration.

## Rollback

Revert the measurement commits or remove the `js/ad-measurement.js` script inclusion and the OpenAI CSP allowances. Restore the privacy notice to reflect actual behavior. Confirm no SDK requests remain.
