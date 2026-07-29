/* AFLODAY — etkileşim katmanı. Bağımlılık yok. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hdr = document.querySelector('.hdr');
  var hero = document.querySelector('.hero-video, .hero-cine');
  var drawer = document.querySelector('.drawer');
  var burger = document.querySelector('.burger');

  /* --- Video hero --------------------------------------------------------
     Poster her zaman ilk boyanır. Video yalnızca gerçekten oynamaya
     başladığında görünür hale gelir; oynayamazsa poster kalıcı hero olur. */
  (function () {
    var hero = document.querySelector('.hero-video');
    if (!hero) return;
    var video = hero.querySelector('video');
    var playBtn = hero.querySelector('[data-play-video]');
    if (!video) return;

    var saveData = navigator.connection && navigator.connection.saveData;

    function showPosterMode() {
      hero.setAttribute('data-mode', 'poster');
      video.removeAttribute('data-playing');
    }

    function start() {
      video.setAttribute('preload', 'auto');
      video.load();
      var p = video.play();
      if (p && p.catch) p.catch(showPosterMode);
    }

    video.addEventListener('playing', function () {
      video.setAttribute('data-playing', 'true');
      hero.setAttribute('data-mode', 'video');
    });
    video.addEventListener('error', showPosterMode);

    // Kullanıcı hareket azaltma istediyse ya da veri tasarrufu açıksa oynatma
    if (reduced || saveData) {
      showPosterMode();
    } else {
      // Görünür olduğunda başlat, görünmezken duraklat — boşuna dekoda etme
      if ('IntersectionObserver' in window) {
        var vio = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) start();
            else if (!video.paused) video.pause();
          });
        }, { threshold: 0.15 });
        vio.observe(hero);
      } else {
        start();
      }
      // Oynama hiç başlamazsa postere düş
      setTimeout(function () {
        if (!video.getAttribute('data-playing')) showPosterMode();
      }, 5000);
    }

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        hero.setAttribute('data-mode', 'video');
        start();
      });
    }
  })();

  /* --- Marquee: kusursuz döngü için şeridi ikiye katla ------------------- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
    track.setAttribute('aria-hidden', 'false');
    // Kopyayı ekran okuyuculardan gizle
    var kids = track.children, half = kids.length / 2;
    for (var i = half; i < kids.length; i++) kids[i].setAttribute('aria-hidden', 'true');
  });

  /* --- Başlık durumu + parallax ----------------------------------------- */
  var parallaxItems = [];
  if (!reduced) {
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      parallaxItems.push({ el: el, amount: parseFloat(el.getAttribute('data-parallax')) || 10 });
    });
  }

  var lastY = 0, ticking = false;

  function frame() {
    var y = window.scrollY;

    if (hdr) {
      // Video hero'lu sayfada bant, hero bitene kadar şeffaf kalır (CSS :has ile).
      // Diğer sayfalarda yalnızca küçülme/gölge için eşik.
      var overHero = hero && y < hero.offsetHeight - hdr.offsetHeight;
      hdr.classList.toggle('is-solid', !overHero && y > 8);

      var open = drawer && drawer.getAttribute('data-open') === 'true';
      if (!reduced && !open && y > 560) {
        hdr.classList.toggle('hdr-hidden', y > lastY);
      } else {
        hdr.classList.remove('hdr-hidden');
      }
    }

    for (var i = 0; i < parallaxItems.length; i++) {
      var it = parallaxItems[i];
      var box = it.el.getBoundingClientRect();
      if (box.bottom < -200 || box.top > window.innerHeight + 200) continue;
      // -1 .. 1 aralığında ilerleme
      var p = (box.top + box.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + box.height / 2);
      it.el.style.transform = 'translate3d(0,' + (p * it.amount).toFixed(2) + '%,0)';
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(frame); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', frame, { passive: true });
  frame();

  /* --- Mobil çekmece ----------------------------------------------------- */
  if (burger && drawer) {
    var setDrawer = function (open) {
      drawer.setAttribute('data-open', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.querySelector('.sr-only').textContent = open ? 'Menüyü kapat' : 'Menüyü aç';
      document.body.classList.toggle('nav-open', open);
      if (open && hdr) { hdr.classList.remove('hdr-hidden'); }
      else frame();
    };
    burger.addEventListener('click', function () {
      setDrawer(drawer.getAttribute('data-open') !== 'true');
    });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });

    /* Alt menüler — açılır katman */
    drawer.querySelectorAll('.drawer-ac').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var grup = btn.closest('.drawer-grup');
        var acik = grup.getAttribute('data-acik') === 'true';
        grup.setAttribute('data-acik', acik ? 'false' : 'true');
        btn.setAttribute('aria-expanded', acik ? 'false' : 'true');
      });
    });

    /* Mega menü — klavye ve dokunmatik için tıklamayla da açılsın */
    document.querySelectorAll('.nav > ul > li.has-mega > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (!window.matchMedia('(hover: none)').matches) return;
        var li = a.parentNode;
        if (li.getAttribute('data-acik') !== 'true') {
          e.preventDefault();
          document.querySelectorAll('.nav > ul > li.has-mega').forEach(function (o) { o.removeAttribute('data-acik'); });
          li.setAttribute('data-acik', 'true');
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-mega')) {
        document.querySelectorAll('.nav > ul > li.has-mega').forEach(function (o) { o.removeAttribute('data-acik'); });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.nav > ul > li.has-mega').forEach(function (o) { o.removeAttribute('data-acik'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') { setDrawer(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1200) setDrawer(false); });
  }

  /* --- Kaydırma açığa çıkarma ------------------------------------------- */
  var targets = document.querySelectorAll('[data-reveal]');
  if (targets.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      targets.forEach(function (el) {
        if (el.getAttribute('data-reveal') === 'stagger') {
          var sibs = Array.prototype.filter.call(el.parentNode.children, function (n) {
            return n.getAttribute && n.getAttribute('data-reveal') === 'stagger';
          });
          el.style.setProperty('--d', Math.min(sibs.indexOf(el), 3) * 110 + 'ms');
        }
        io.observe(el);
      });
    }
  }

  /* --- Başlık açılış dizisi (sinematik hero ve folyo başlığı) ------------ */
  if (!reduced) {
    document.querySelectorAll('.hero-cine, .folio').forEach(function (host) {
      var base = host.classList.contains('hero-cine') ? 260 : 140;
      host.querySelectorAll('.line > span').forEach(function (el, i) {
        el.style.setProperty('--d', base + i * 120 + 'ms');
      });
    });
  }

  /* --- Yatay ray: tekerlek ile yatay kaydırma ---------------------------- */
  document.querySelectorAll('.rail').forEach(function (rail) {
    rail.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var atStart = rail.scrollLeft <= 0;
      var atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1;
      // Uçlarda sayfayı serbest bırak — kaydırma kilitlenmesin
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }, { passive: false });
  });

  /* --- Demo formları ------------------------------------------------------ */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = document.getElementById(form.getAttribute('data-demo'));
      if (!ok) return;
      ok.setAttribute('data-show', 'true');
      form.style.display = 'none';
      ok.setAttribute('tabindex', '-1');
      ok.focus();
      ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* --- Yıl ---------------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- Galeri ışık kutusu ------------------------------------------------ */
  (function () {
    var lb = document.getElementById('lb');
    var cells = [].slice.call(document.querySelectorAll('.galeri-hucre'));
    if (!lb || !cells.length) return;
    var img = lb.querySelector('.lb-img');
    var sayac = lb.querySelector('.lb-sayac');
    var i = 0, sonOdak = null;

    function goster(n) {
      i = (n + cells.length) % cells.length;
      var c = cells[i];
      img.src = c.getAttribute('data-full');
      img.alt = c.querySelector('img').alt;
      sayac.textContent = (i + 1) + ' / ' + cells.length;
    }
    function ac(n) {
      sonOdak = document.activeElement;
      goster(n); lb.hidden = false;
      document.body.classList.add('lb-acik');
      lb.querySelector('.lb-kapat').focus();
    }
    function kapat() {
      lb.hidden = true; img.src = '';
      document.body.classList.remove('lb-acik');
      if (sonOdak) sonOdak.focus();
    }
    cells.forEach(function (c, n) { c.addEventListener('click', function () { ac(n); }); });
    lb.querySelector('.lb-kapat').addEventListener('click', kapat);
    lb.querySelector('.lb-onceki').addEventListener('click', function () { goster(i - 1); });
    lb.querySelector('.lb-sonraki').addEventListener('click', function () { goster(i + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) kapat(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') kapat();
      else if (e.key === 'ArrowLeft') goster(i - 1);
      else if (e.key === 'ArrowRight') goster(i + 1);
    });
    // Dokunmatik kaydırma
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) goster(i + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  })();


  /* --- Karakter sayacı (orijinal formlardaki 0/500) ---------------------- */
  document.querySelectorAll('[data-sayac]').forEach(function (out) {
    var alan = document.getElementById(out.getAttribute('data-sayac'));
    if (!alan) return;
    var guncelle = function () { out.textContent = alan.value.length; };
    alan.addEventListener('input', guncelle);
    guncelle();
  });

})();
