// Resize the same-origin wrapper to Lodgify's live content, including open calendars.
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.data?.type !== 'lodgify-height') return;
  for (const frame of document.querySelectorAll('.lodgify-widget iframe')) {
    if (event.source === frame.contentWindow && Number.isFinite(event.data.height)) frame.style.height = `${Math.max(140, Math.min(1600, event.data.height))}px`;
  }
});
const picker = document.querySelector('#stay-picker');
picker?.addEventListener('change', () => {
  if (!['603326', '603323', '728474'].includes(picker.value)) return;
  const frame = document.querySelector('.lodgify-widget iframe');
  frame.src = `lodgify-widget.html?property=${picker.value}&currency=USD`;
  document.querySelector('.checkout-link').href = `https://checkout.lodgify.com/en/ogr/${picker.value}/reservation?currency=USD`;
});
