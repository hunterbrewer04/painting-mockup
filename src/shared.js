/* ATELIER VERMEIL — shared runtime (loads after all sections) */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.AV = { reduced: reduced };

  /* ---- scroll reveals ---------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  /* stagger children of [data-reveal-group] */
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal-group]'), function (group) {
    var step = parseFloat(group.getAttribute('data-reveal-stagger') || '0.09');
    var kids = group.querySelectorAll(':scope > [data-reveal], :scope [data-reveal]');
    Array.prototype.forEach.call(kids, function (el, i) {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', (i * step).toFixed(2) + 's');
      }
    });
  });

  if (reduced) {
    revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- rAF-batched scroll driver (parallax etc.) -------------- */
  var scrollFns = [];
  window.AV.onScroll = function (fn) { scrollFns.push(fn); fn(window.scrollY); };
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      for (var i = 0; i < scrollFns.length; i++) scrollFns[i](y);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- custom cursor (fine pointers only) ---------------------- */
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer && !reduced) {
    var ring = document.createElement('div');
    ring.id = 'av-cursor';
    ring.setAttribute('aria-hidden', 'true');
    var label = document.createElement('span');
    ring.appendChild(label);
    document.body.appendChild(ring);

    var st = document.createElement('style');
    st.textContent =
      '#av-cursor{position:fixed;top:0;left:0;width:14px;height:14px;border:1px solid var(--bronze);' +
      'border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-100px,-100px);' +
      'display:flex;align-items:center;justify-content:center;' +
      'transition:width .45s var(--ease-out),height .45s var(--ease-out),background-color .3s ease,opacity .3s ease;' +
      'background:rgba(156,123,74,0);opacity:0;}' +
      '#av-cursor.is-live{opacity:1;}' +
      '#av-cursor.is-active{width:64px;height:64px;background:rgba(28,25,22,.82);border-color:rgba(197,164,104,.9);}' +
      '#av-cursor span{font:600 .58rem/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;' +
      'color:#EFEAE3;opacity:0;transition:opacity .3s ease .1s;}' +
      '#av-cursor.is-active span{opacity:1;}';
    document.head.appendChild(st);

    var cx = -100, cy = -100, tx = -100, ty = -100, live = false;
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!live) { live = true; ring.classList.add('is-live'); cx = tx; cy = ty; }
    });
    document.addEventListener('mouseleave', function () { live = false; ring.classList.remove('is-live'); });
    (function loop() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      ring.style.transform = 'translate(' + (cx - ring.offsetWidth / 2) + 'px,' + (cy - ring.offsetHeight / 2) + 'px)';
      requestAnimationFrame(loop);
    })();

    document.body.classList.add('av-cursor-on');
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button');
      if (t) {
        ring.classList.add('is-active');
        label.textContent = (t.getAttribute && t.getAttribute('data-cursor')) || '';
      } else {
        ring.classList.remove('is-active');
      }
    });
  }

  /* ---- magnetic elements [data-magnetic] ----------------------- */
  if (finePointer && !reduced) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic]'), function (el) {
      var strength = 14;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        el.style.transition = 'transform .2s ease-out';
        el.style.transform = 'translate(' + dx * strength + 'px,' + dy * strength + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s var(--ease-out)';
        el.style.transform = 'translate(0,0)';
      });
    });
  }
})();
