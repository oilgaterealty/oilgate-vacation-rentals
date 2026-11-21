// Lodgify's native external search widget, isolated from the site's CSS.
// Its URL parser uses the documented legacy checkout format as input.
const params = new URLSearchParams(location.search);
const id = params.get('property');
if (['603326', '603323', '728474'].includes(id)) {
  const root = document.getElementById('lodgify-search-bar');
  Object.assign(root.dataset, { websiteId: '517856', languageCode: 'en', checkoutPageUrl: `https://checkout.lodgify.com/ogr/en/#/${id}`, newTab: 'true', hideLocation: 'true', datesCheckInLabel: 'Check-in', datesCheckOutLabel: 'Check-out', guestsInputSingularLabel: '{NumberOfGuests} guest', guestsInputPluralLabel: '{NumberOfGuests} guests', locationInputLabel: 'Location', searchButtonLabel: 'Check dates on Lodgify' });
  const script = document.createElement('script');
  script.src = 'https://app.lodgify.com/portable-search-bar/stable/renderPortableSearchBar.js';
  document.body.append(script);
  const reportHeight = () => {
    // Lodgify calendars are absolutely positioned portals, outside normal flow.
    const bottoms = [...document.body.querySelectorAll('*')].map(el => el.getBoundingClientRect()).filter(r => r.width && r.height).map(r => r.bottom);
    parent.postMessage({ type: 'lodgify-height', height: Math.ceil(Math.max(120, ...bottoms) + 20) }, location.origin);
  };
  new ResizeObserver(reportHeight).observe(root);
  new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'aria-expanded'] });
  // Lodgify initializes currency asynchronously; keep checkout explicitly in USD.
  const normalizeCheckout = () => root.querySelectorAll('a[href]').forEach(a => {
    const url = new URL(a.href);
    if (url.hostname === 'checkout.lodgify.com' && url.searchParams.get('currency') !== 'USD') { url.searchParams.set('currency', 'USD'); a.href = url.href; }
  });
  new MutationObserver(normalizeCheckout).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
} else document.body.textContent = 'Choose a property from the Oilgate site.';
