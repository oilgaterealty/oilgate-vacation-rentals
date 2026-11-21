// Shared booking search for the OVR design previews.
// Builds a Lodgify checkout link for the chosen stay, dates and guests.
// No prices are shown or guessed here: Lodgify shows the real total.
(function () {
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  document.querySelectorAll('form[data-book]').forEach(function (form) {
    var inEl = form.querySelector('[name="arrival"]');
    var outEl = form.querySelector('[name="departure"]');
    var msg = form.querySelector('[data-book-msg]');
    var today = new Date();
    if (inEl) inEl.min = iso(today);
    if (inEl && outEl) {
      inEl.addEventListener('change', function () {
        if (!inEl.value) return;
        var next = new Date(inEl.value + 'T12:00:00');
        next.setDate(next.getDate() + 1);
        outEl.min = iso(next);
        if (!outEl.value || outEl.value <= inEl.value) outEl.value = iso(next);
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var stay = form.querySelector('[name="stay"]').value;
      var guests = form.querySelector('[name="guests"]').value || '1';
      var a = inEl && inEl.value, d = outEl && outEl.value;
      if (msg) msg.textContent = '';
      if (a && d && d <= a) {
        if (msg) msg.textContent = 'Check-out must be after check-in.';
        outEl.focus();
        return;
      }
      var url = 'https://checkout.lodgify.com/en/ogr/' + encodeURIComponent(stay) + '/reservation?currency=USD&adults=' + encodeURIComponent(guests);
      if (a && d) url += '&arrival=' + a + '&departure=' + d;
      window.open(url, '_blank', 'noopener');
    });
  });
})();
