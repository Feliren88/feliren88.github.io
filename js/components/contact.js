(function () {
  'use strict';
  var button = document.getElementById('ct-copy');
  var status = document.getElementById('ct-copy-status');
  if (!button || !status) return;
  button.addEventListener('click', function () {
    var email = button.getAttribute('data-email');
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      status.textContent = email;
      return;
    }
    navigator.clipboard.writeText(email).then(function () {
      status.textContent = 'Email copied.';
      button.textContent = 'Copied';
      window.setTimeout(function () { button.textContent = 'Copy email'; status.textContent = ''; }, 2200);
    }).catch(function () { status.textContent = email; });
  });
}());
