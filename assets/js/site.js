document.addEventListener('DOMContentLoaded', function () {
  var body = document.body;

  /* Blur-up: images sharpen once loaded */
  document.querySelectorAll('.grid .media img').forEach(function (img) {
    if (img.complete && img.naturalWidth) img.classList.add('loaded');
    else img.addEventListener('load', function () { img.classList.add('loaded'); });
  });

  /* Off-canvas menu */
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  });
  var veil = document.querySelector('.veil');
  if (veil) veil.addEventListener('click', function () { setMenu(false); });

  /* Centered series label: follows the work under the middle of the screen */
  var term = document.querySelector('.term');
  var figures = [].slice.call(document.querySelectorAll('.grid figure'));
  if (term && figures.length) {
    var termBtn = term.querySelector('button');
    var termText = termBtn.querySelector('.term-text');
    var links = [].slice.call(term.querySelectorAll('a[data-series]'));
    var current = '';
    var update = function () {
      var mid = window.innerHeight / 2, pick = figures[0];
      for (var i = 0; i < figures.length; i++) {
        if (figures[i].getBoundingClientRect().top <= mid) pick = figures[i];
        else break;
      }
      var s = pick.getAttribute('data-series');
      if (s && s !== current) {
        current = s;
        termText.textContent = s;
        links.forEach(function (a) { a.classList.toggle('current', a.getAttribute('data-series') === s); });
      }
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    var setTerm = function (open) {
      term.classList.toggle('open', open);
      termBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    termBtn.addEventListener('click', function (e) { e.stopPropagation(); setTerm(!term.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!term.contains(e.target)) setTerm(false); });
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var first = document.querySelector('.grid figure[data-series="' + a.getAttribute('data-series') + '"]');
        setTerm(false);
        if (first) {
          var y = first.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + 40;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      });
    });
  }

  /* Lightbox with previous / next */
  var lb = document.getElementById('lightbox');
  if (lb && figures.length) {
    var lbImg = lb.querySelector('.stage img');
    var lbTitle = lb.querySelector('.cap .title');
    var lbMeta = lb.querySelector('.cap .meta');
    var lbPos = lb.querySelector('.pos');
    var idx = 0, opener = null;

    var show = function (i) {
      idx = (i + figures.length) % figures.length;
      var f = figures[idx];
      lbImg.src = f.getAttribute('data-full');
      lbImg.alt = f.querySelector('img').alt;
      lbTitle.textContent = f.getAttribute('data-title');
      lbMeta.textContent = f.getAttribute('data-meta');
      lbPos.textContent = (idx + 1) + ' of ' + figures.length;
    };
    var open = function (i) {
      opener = figures[i];
      show(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
      lb.querySelector('.close').focus();
    };
    var close = function () {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
      if (opener) opener.focus();
    };

    figures.forEach(function (f, i) {
      f.addEventListener('click', function () { open(i); });
      f.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });
    lb.querySelector('.close').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.next').addEventListener('click', function () { show(idx + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
  });
});
