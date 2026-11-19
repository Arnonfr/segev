document.addEventListener('DOMContentLoaded', function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var img = lb.querySelector('img');
  var cap = lb.querySelector('.cap');
  document.querySelectorAll('[data-full]').forEach(function (el) {
    el.addEventListener('click', function () {
      img.src = el.getAttribute('data-full');
      cap.textContent = el.getAttribute('data-cap') || '';
      lb.classList.add('open');
    });
  });
  lb.addEventListener('click', function () { lb.classList.remove('open'); img.src = ''; });
});
