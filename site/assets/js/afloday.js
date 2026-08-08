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
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000) setDrawer(false); });
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
        /* threshold 0 ŞART — yüzde eşiği uzun bölümlerde hiç tetiklenmiyor.
           Görünürlük oranı, ögenin yüksekliğine bölünerek hesaplanıyor:
           telefonda 7935px'lik akordeon 844px'lik ekranda en fazla %10
           görünebiliyor, %12 eşiğine hiç ulaşamıyordu. Sonuç: bölüm
           kalıcı olarak opaklık 0'da kalıp boş görünüyordu (masaüstünde
           aynı bölüm 2953px olduğu için %28'e çıkıp tetikleniyordu).
           threshold 0 ile herhangi bir kesişme yeter; "ekrana girsin de
           sonra açılsın" etkisini rootMargin veriyor. */
      }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

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

  /* --- Anasayfa slaydı ---------------------------------------------------
     Kareler çapraz geçişle dönüyor. Duraklatma dört yolla oluyor: fare üstteyken,
     odak içerideyken, sekme arkadayken ve düğmeyle. Azaltılmış hareket
     tercihinde otomatik geçiş hiç başlamıyor; kareler yine çeteleyle geziliyor.
     Süre CSS'teki dolum animasyonuyla aynı değerden besleniyor. */
  document.querySelectorAll('[data-slayt]').forEach(function (slayt) {
    var kareler = [].slice.call(slayt.querySelectorAll('.slayt-kare'));
    var cetel = [].slice.call(slayt.querySelectorAll('[data-slayt-git]'));
    var no = slayt.querySelector('[data-slayt-no]');
    var durdurBtn = slayt.querySelector('[data-slayt-duraklat]');
    if (kareler.length < 2) return;

    var SURE = 6000, GECIS = 1200;
    var i = 0, sayac = null, elle = false;
    slayt.style.setProperty('--slayt-sure', SURE + 'ms');
    slayt.style.setProperty('--slayt-gecis', GECIS + 'ms');

    function iki(n) { return n < 10 ? '0' + n : String(n); }

    function goster(y) {
      var eski = i;
      i = (y + kareler.length) % kareler.length;
      kareler.forEach(function (k, n) {
        var aktif = n === i;
        k.setAttribute('data-aktif', aktif ? 'evet' : 'hayir');
        /* Çıkan kare, daire açılımı bitene kadar altta duruyor; kaldırılırsa
           açılan dairenin dışında boşluk görünür. */
        if (n === eski && n !== i) k.setAttribute('data-onceki', 'evet');
        else k.removeAttribute('data-onceki');
        if (aktif) { k.removeAttribute('aria-hidden'); k.removeAttribute('tabindex'); }
        else { k.setAttribute('aria-hidden', 'true'); k.setAttribute('tabindex', '-1'); }
      });
      /* Animasyonu baştan başlat — aynı sınıf yeniden atandığında tarayıcı
         kendiliğinden tekrarlamıyor. */
      var yeni = kareler[i];
      yeni.style.animation = 'none';
      void yeni.offsetWidth;
      yeni.style.animation = '';
      cetel.forEach(function (b, n) {
        if (n === i) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
      if (no) no.textContent = iki(i + 1);
      /* Dolum animasyonunu baştan başlat: yeniden akış zorlanmazsa
         tarayıcı aynı animasyonu sürdürüyor ve çubuk dolu kalıyor. */
      var c = cetel[i] && cetel[i].firstElementChild;
      if (c) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; }
    }

    function basla() {
      if (reduced || elle) return;
      dur();
      sayac = setInterval(function () { goster(i + 1); }, SURE);
      slayt.setAttribute('data-durdu', 'hayir');
    }
    function dur() {
      if (sayac) { clearInterval(sayac); sayac = null; }
      slayt.setAttribute('data-durdu', 'evet');
    }

    cetel.forEach(function (b) {
      b.addEventListener('click', function () {
        goster(parseInt(b.getAttribute('data-slayt-git'), 10) || 0);
        if (!elle) basla();
      });
    });

    if (durdurBtn) {
      durdurBtn.addEventListener('click', function () {
        elle = !elle;
        durdurBtn.setAttribute('aria-pressed', elle ? 'true' : 'false');
        durdurBtn.textContent = elle ? 'Devam et' : 'Duraklat';
        if (elle) dur(); else basla();
      });
      if (reduced) durdurBtn.hidden = true;
    }

    /* Klavye: sol/sağ ok karelerde gezdiriyor */
    slayt.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { goster(i + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { goster(i - 1); e.preventDefault(); }
    });

    slayt.addEventListener('mouseenter', dur);
    slayt.addEventListener('mouseleave', function () { if (!elle) basla(); });
    slayt.addEventListener('focusin', dur);
    slayt.addEventListener('focusout', function () {
      if (!elle && !slayt.contains(document.activeElement)) basla();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) dur(); else if (!elle) basla();
    });

    goster(0);
    basla();
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

  /* --- Galeri ışık kutusu & Awwwards etkileşimleri ---------------------- */
  (function () {
    var lb = document.getElementById('lb');
    var app = document.querySelector('[data-galeri-app]');
    var sahne = document.querySelector('[data-galeri-sahne]');

    /* --- Floating Cursor Badge Indicator (Fare Takipçisi) --- */
    var cursorBadge = document.createElement('div');
    cursorBadge.className = 'cursor-badge';
    cursorBadge.setAttribute('aria-hidden', 'true');
    cursorBadge.textContent = 'BÜYÜT ↗';
    document.body.appendChild(cursorBadge);

    var cardSelector = '.galeri-hucre, .serit-panel, .galeri-home-kart, .galeri-awwwards-kart, .slider-card';

    if (!reduced && !window.matchMedia('(hover: none)').matches) {
      document.addEventListener('mousemove', function (e) {
        var card = e.target.closest(cardSelector);
        if (card) {
          cursorBadge.style.left = e.clientX + 'px';
          cursorBadge.style.top = e.clientY + 'px';
          var customText = card.getAttribute('data-no') ? ('FOTO ' + card.getAttribute('data-no') + ' · BÜYÜT ↗') : 'BÜYÜT ↗';
          cursorBadge.textContent = customText;
          cursorBadge.classList.add('is-active');
        } else {
          cursorBadge.classList.remove('is-active');
        }
      });
    }

    /* --- Duraklat düğmesi ---------------------------------------------------
       Şerit 36 saniyede bir tur atıyor ve yalnız fareyle duruyordu. Klavye
       ya da dokunmatik kullanan için durdurmanın yolu yoktu; WCAG 2.2.2
       beş saniyeden uzun otomatik hareketin durdurulabilmesini istiyor. */
    document.querySelectorAll('[data-galeri-durdur]').forEach(function (btn) {
      var kap = btn.closest('[data-galeri-app]');
      if (!kap) return;
      var etiket = btn.querySelector('[data-durdur-metin]') || btn;
      btn.addEventListener('click', function () {
        var durdu = kap.getAttribute('data-durdu') === 'true';
        kap.setAttribute('data-durdu', durdu ? 'false' : 'true');
        btn.setAttribute('aria-pressed', durdu ? 'false' : 'true');
        etiket.textContent = durdu ? 'Duraklat' : 'Devam et';
      });
    });

    /* --- Kategori Filtreleme Mantığı --- */
    if (app && sahne) {
      var filterBtns = app.querySelectorAll('.galeri-filtre-btn');
      var layoutBtns = app.querySelectorAll('.galeri-duzen-btn');
      var items = [].slice.call(sahne.querySelectorAll('.galeri-awwwards-kart'));

      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterBtns.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          var cat = btn.getAttribute('data-filter');
          sahne.classList.add('is-filtering');

          setTimeout(function () {
            items.forEach(function (item) {
              var itemCat = item.getAttribute('data-kategori');
              if (cat === 'all' || itemCat === cat) {
                item.classList.remove('is-hidden');
              } else {
                item.classList.add('is-hidden');
              }
            });
            sahne.classList.remove('is-filtering');
          }, 150);
        });
      });

      /* --- Görünüm Modu Değiştirici (Izgara vs Şerit) --- */
      layoutBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          layoutBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var mode = btn.getAttribute('data-duzen');

          if (mode === 'serit') {
            sahne.classList.remove('izgara-layout');
            sahne.classList.add('serit-layout');
          } else {
            sahne.classList.remove('serit-layout');
            sahne.classList.add('izgara-layout');
          }
        });
      });
    }

    /* --- Yenilenmiş Işık Kutusu (Fullscreen Interactive Lightbox) --- */
    if (!lb) return;
    var img = lb.querySelector('.lb-img');
    var sayac = lb.querySelector('#lb-sayac, .lb-sayac');
    var caption = lb.querySelector('#lb-caption');
    var i = 0, sonOdak = null;

    function getActiveCells() {
      var all = [].slice.call(document.querySelectorAll(cardSelector));
      return all.filter(function (c) {
        /* Sonsuz şerit kesintisiz görünsün diye kareleri iki kez basıyor.
           Kopyalar sayılırsa ışık kutusu "5 / 42" diyor ve ok tuşları aynı
           fotoğrafı iki kez geziyordu. */
        if (c.hasAttribute('data-kopya')) return false;
        return c.offsetWidth > 0 && c.offsetHeight > 0 && !c.classList.contains('is-hidden');
      });
    }

    function goster(n) {
      var cells = getActiveCells();
      if (!cells.length) return;
      i = (n + cells.length) % cells.length;
      var c = cells[i];
      img.src = c.getAttribute('data-full') || c.getAttribute('data-src') || '';
      img.alt = (c.querySelector('img') && c.querySelector('img').alt) || '';
      
      var capText = c.getAttribute('data-caption') || img.alt || 'Afloday Galeri';
      if (caption) caption.textContent = capText;
      if (sayac) sayac.textContent = (i + 1) + ' / ' + cells.length;
    }

    function ac(cell) {
      var cells = getActiveCells();
      var n = cells.indexOf(cell);
      if (n < 0) n = 0;
      sonOdak = document.activeElement;
      goster(n);
      lb.hidden = false;
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lb-acik');
      var kapatBtn = lb.querySelector('.lb-kapat');
      if (kapatBtn) kapatBtn.focus();
    }

    function kapat() {
      lb.hidden = true;
      lb.setAttribute('aria-hidden', 'true');
      if (img) img.src = '';
      document.body.classList.remove('lb-acik');
      if (sonOdak) sonOdak.focus();
    }

    document.addEventListener('click', function (e) {
      var card = e.target.closest(cardSelector);
      if (card && card.hasAttribute('data-full')) {
        e.preventDefault();
        ac(card);
      }
    });

    var kapatBtn = lb.querySelector('.lb-kapat');
    if (kapatBtn) kapatBtn.addEventListener('click', kapat);
    var oncekiBtn = lb.querySelector('.lb-onceki');
    if (oncekiBtn) oncekiBtn.addEventListener('click', function () { goster(i - 1); });
    var sonrakiBtn = lb.querySelector('.lb-sonraki');
    if (sonrakiBtn) sonrakiBtn.addEventListener('click', function () { goster(i + 1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-stage') || e.target.classList.contains('lb-img-wrap')) kapat();
    });

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


  /* --- Hero slaydı: cam kırılması geçişi ---------------------------------
     Tasarım kaynağı: 21st.dev · lumina-interactive-list.
     Shader kaynaktaki `glassEffect` ile birebir; merkezden büyüyen daire,
     kenarda ışık kırılması, renk sapması ve sıvı akış.

     Kaynakta Three.js + GSAP CDN'den ~650 KB iniyordu. Efektin tamamı tek bir
     fragment shader olduğu için burada düz WebGL kullanılıyor: tam ekran bir
     dörtgen ve aynı shader. Görsel sonuç aynı, eklenen ağırlık sıfır.
     Kaynaktaki diğer dört efekt (frost/ripple/plasma/timeshift) zaten boş
     mix() döndürüyordu, alınmadı.

     WebGL yoksa ya da shader derlenmezse hiçbir şey olmuyor: alttaki <img>
     kareleri görünür kalıyor ve CSS daire açılımı geçişi devralıyor. */
  document.querySelectorAll('[data-hslayt]').forEach(function (kok) {
    var kareler = [].slice.call(kok.querySelectorAll('.slide-media-kare'));
    var yazilar = [].slice.call(kok.querySelectorAll('.slide-copy'));
    var gitler = [].slice.call(kok.querySelectorAll('[data-hslayt-git]'));
    var no = kok.querySelector('[data-hslayt-no]');
    var durdurBtn = kok.querySelector('[data-hslayt-duraklat]');
    var tuval = kok.querySelector('[data-hslayt-tuval]');
    if (kareler.length < 2) return;

    /* Kaynaktaki SLIDER_CONFIG değerleri. Cam ayarları referans belgesindeki
       "Subtle ile Default arası" notuna göre biraz yumuşatıldı — Afloday'in
       dili sakin, kaynaktaki moda çekimi kadar sert değil. */
    var SURE = 5000;       // autoSlideSpeed
    var GECIS = 2500;      // transitionDuration
    var CAM = {
      refraction: 0.8, chromatic: 0.7, clarity: 1.15, edgeGlow: 0.85, flow: 0.9,
      global: 1.0, speed: 1.0, distortion: 1.0
    };

    var i = 0, sayac = null, elle = false, gecisAnim = null;
    kok.style.setProperty('--hslayt-sure', SURE + 'ms');
    kok.style.setProperty('--hslayt-gecis', GECIS + 'ms');

    function iki(n) { return n < 10 ? '0' + n : String(n); }

    /* ---- WebGL katmanı ---- */
    var gl = null, prog = null, uni = {}, dokular = [], cizimSurer = false;

    var VS =
      'attribute vec2 aPos; varying vec2 vUv;' +
      'void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }';

    var FS = [
      'precision highp float;',
      'uniform sampler2D uTexture1, uTexture2;',
      'uniform float uProgress;',
      'uniform vec2 uResolution, uTexture1Size, uTexture2Size;',
      'uniform vec2 uFocus1, uFocus2;',
      'uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;',
      'uniform float uGlassRefractionStrength, uGlassChromaticAberration;',
      'uniform float uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;',
      'varying vec2 vUv;',
      /* Görseli kutuya "cover" gibi oturtur. Kaynakta kırpma hep merkezden
         (0.5) alınıyordu; burada odak noktası dışarıdan geliyor, böylece
         tam ekranda öznenin kesilmesi engelleniyor. focus=0.5,0.5 verilirse
         davranış kaynakla birebir aynı. */
      'vec2 getCoverUV(vec2 uv, vec2 textureSize, vec2 focus){',
      '  vec2 s = uResolution / textureSize;',
      '  float scale = max(s.x, s.y);',
      '  vec2 scaledSize = textureSize * scale;',
      '  vec2 offset = (uResolution - scaledSize) * focus;',
      '  return (uv * uResolution - offset) / scaledSize;',
      '}',
      'void main(){',
      '  vec2 uv = vUv; float progress = uProgress;',
      '  float time = progress * 5.0 * uSpeedMultiplier;',
      '  vec2 uv1 = getCoverUV(uv, uTexture1Size, uFocus1);',
      '  vec2 uv2 = getCoverUV(uv, uTexture2Size, uFocus2);',
      '  float maxR = length(uResolution) * 0.85;',
      '  float br = progress * maxR;',
      '  vec2 p = uv * uResolution; vec2 c = uResolution * 0.5;',
      '  float d = length(p - c); float nd = d / max(br, 0.001);',
      '  float param = smoothstep(br + 3.0, br - 3.0, d);',
      '  vec4 img;',
      '  if (param > 0.0) {',
      '    float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity',
      '             * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);',
      '    vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);',
      '    vec2 distUV = uv2 - dir * ro;',
      '    distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0))',
      '            * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;',
      '    float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity',
      '             * pow(smoothstep(0.3, 1.0, nd), 1.2);',
      '    img = vec4(texture2D(uTexture2, distUV + dir * ca * 1.2).r,',
      '               texture2D(uTexture2, distUV + dir * ca * 0.2).g,',
      '               texture2D(uTexture2, distUV - dir * ca * 0.8).b, 1.0);',
      '    float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));',
      '    img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;',
      '  } else { img = texture2D(uTexture2, uv2); }',
      '  vec4 oldImg = texture2D(uTexture1, uv1);',
      '  if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);',
      '  gl_FragColor = mix(oldImg, img, param);',
      '}'
    ].join('\n');

    function derle(tur, kaynak) {
      var s = gl.createShader(tur);
      gl.shaderSource(s, kaynak);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }

    function dokuYap(img) {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      /* Fotoğraflar ikinin kuvveti ölçüde değil; mipmap ve tekrar kapalı olmalı. */
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return { doku: t, en: img.naturalWidth, boy: img.naturalHeight };
    }

    /* data-odak "50,25" biçiminde, CSS object-position gibi soldan ve ÜSTTEN
       yüzde. Shader'da doku y ekseni ters çevrili (UNPACK_FLIP_Y), bu yüzden
       y burada 1'den çıkarılıyor. */
    function odakAl(n) {
      var ham = (kareler[n].getAttribute('data-odak') || '50,50').split(',');
      var x = (parseFloat(ham[0]) || 50) / 100;
      var y = (parseFloat(ham[1]) || 50) / 100;
      return [x, 1 - y];
    }

    function webglKur() {
      if (reduced || !tuval) return false;
      try {
        gl = tuval.getContext('webgl', { antialias: false, alpha: false })
          || tuval.getContext('experimental-webgl');
      } catch (e) { gl = null; }
      if (!gl) return false;

      var vs = derle(gl.VERTEX_SHADER, VS), fs = derle(gl.FRAGMENT_SHADER, FS);
      if (!vs || !fs) return false;
      prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      ['uTexture1', 'uTexture2', 'uProgress', 'uResolution', 'uTexture1Size', 'uTexture2Size',
        'uFocus1', 'uFocus2',
        'uGlobalIntensity', 'uSpeedMultiplier', 'uDistortionStrength',
        'uGlassRefractionStrength', 'uGlassChromaticAberration',
        'uGlassBubbleClarity', 'uGlassEdgeGlow', 'uGlassLiquidFlow'
      ].forEach(function (n) { uni[n] = gl.getUniformLocation(prog, n); });

      gl.uniform1i(uni.uTexture1, 0);
      gl.uniform1i(uni.uTexture2, 1);
      gl.uniform1f(uni.uGlobalIntensity, CAM.global);
      gl.uniform1f(uni.uSpeedMultiplier, CAM.speed);
      gl.uniform1f(uni.uDistortionStrength, CAM.distortion);
      gl.uniform1f(uni.uGlassRefractionStrength, CAM.refraction);
      gl.uniform1f(uni.uGlassChromaticAberration, CAM.chromatic);
      gl.uniform1f(uni.uGlassBubbleClarity, CAM.clarity);
      gl.uniform1f(uni.uGlassEdgeGlow, CAM.edgeGlow);
      gl.uniform1f(uni.uGlassLiquidFlow, CAM.flow);
      return true;
    }

    function olcule() {
      if (!gl) return;
      /* Piksel oranı 2'de sınırlı: 3x ekranlarda kazanç görünmezken
         doldurma maliyeti iki katına çıkıyor. */
      var oran = Math.min(window.devicePixelRatio || 1, 2);
      var en = Math.round(tuval.clientWidth * oran);
      var boy = Math.round(tuval.clientHeight * oran);
      if (!en || !boy) return;
      if (tuval.width !== en || tuval.height !== boy) { tuval.width = en; tuval.height = boy; }
      gl.viewport(0, 0, en, boy);
      gl.uniform2f(uni.uResolution, en, boy);
    }

    function ciz(ilerleme, a, b) {
      if (!gl || !dokular[a] || !dokular[b]) return;
      olcule();
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, dokular[a].doku);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dokular[b].doku);
      gl.uniform2f(uni.uTexture1Size, dokular[a].en, dokular[a].boy);
      gl.uniform2f(uni.uTexture2Size, dokular[b].en, dokular[b].boy);
      var oa = odakAl(a), ob = odakAl(b);
      gl.uniform2f(uni.uFocus1, oa[0], oa[1]);
      gl.uniform2f(uni.uFocus2, ob[0], ob[1]);
      gl.uniform1f(uni.uProgress, ilerleme);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* Kaynaktaki GSAP "power2.inOut" easing'inin karşılığı */
    function kolay(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function camGecisi(eski, yeni) {
      if (gecisAnim) cancelAnimationFrame(gecisAnim);
      var bas = performance.now();
      cizimSurer = true;
      (function adim(simdi) {
        var t = Math.min((simdi - bas) / GECIS, 1);
        ciz(kolay(t), eski, yeni);
        if (t < 1) gecisAnim = requestAnimationFrame(adim);
        else {
          /* Geçiş bitti: yeni kare tek başına duruyor, çizim duruyor.
             Kaynakta render() hiç durmuyordu; boşuna GPU yakmıyoruz. */
          ciz(0, yeni, yeni);
          gecisAnim = null; cizimSurer = false;
        }
      })(bas);
    }

    function dokulariYukle() {
      var imgler = kareler.map(function (k) { return k.querySelector('img'); });
      var hazir = imgler.every(function (im) { return im && im.complete && im.naturalWidth; });
      if (!hazir) return false;
      dokular = imgler.map(dokuYap);
      return true;
    }

    /* ---- Ortak durum ---- */
    function goster(y, gecisli) {
      var eski = i;
      i = (y + kareler.length) % kareler.length;
      if (i === eski && gecisli) return;

      kareler.forEach(function (k, n) {
        k.setAttribute('data-aktif', n === i ? 'evet' : 'hayir');
        if (n === eski && n !== i) k.setAttribute('data-onceki', 'evet');
        else k.removeAttribute('data-onceki');
      });
      /* CSS daire açılımını baştan başlat (WebGL yoksa görünen geçiş bu) */
      var yeniKare = kareler[i];
      yeniKare.style.animation = 'none'; void yeniKare.offsetWidth; yeniKare.style.animation = '';

      yazilar.forEach(function (w, n) {
        var aktif = n === i;
        w.setAttribute('data-aktif', aktif ? 'evet' : 'hayir');
        if (aktif) w.removeAttribute('aria-hidden'); else w.setAttribute('aria-hidden', 'true');
        w.querySelectorAll('a').forEach(function (a) {
          if (aktif) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1');
        });
        /* Harf açılımını baştan başlat */
        if (aktif) { w.querySelectorAll('.slide-title-harf').forEach(function (h) {
          h.style.animation = 'none'; void h.offsetWidth; h.style.animation = '';
        }); }
      });

      gitler.forEach(function (b, n) {
        if (n === i) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
      if (no) no.textContent = iki(i + 1);

      var dolgu = gitler[i] && gitler[i].querySelector('.slide-progress-fill');
      if (dolgu) { dolgu.style.animation = 'none'; void dolgu.offsetWidth; dolgu.style.animation = ''; }

      if (gl && dokular.length) camGecisi(eski, i);
    }

    function basla() {
      if (reduced || elle) return;
      dur();
      sayac = setInterval(function () { goster(i + 1, true); }, SURE);
      kok.setAttribute('data-durdu', 'hayir');
    }
    function dur() {
      if (sayac) { clearInterval(sayac); sayac = null; }
      kok.setAttribute('data-durdu', 'evet');
    }

    gitler.forEach(function (b) {
      b.addEventListener('click', function () {
        goster(parseInt(b.getAttribute('data-hslayt-git'), 10) || 0, true);
        if (!elle) basla();
      });
    });

    if (durdurBtn) {
      durdurBtn.addEventListener('click', function () {
        elle = !elle;
        durdurBtn.setAttribute('aria-pressed', elle ? 'true' : 'false');
        durdurBtn.textContent = elle ? 'Devam et' : 'Duraklat';
        if (elle) dur(); else basla();
      });
      if (reduced) durdurBtn.hidden = true;
    }

    kok.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goster(i - 1, true); if (!elle) basla(); }
      else if (e.key === 'ArrowRight') { goster(i + 1, true); if (!elle) basla(); }
      else return;
      e.preventDefault();
    });

    /* Üzerine gelince ve odak içerideyken duruyor — hareketli içerik gereği */
    kok.addEventListener('mouseenter', dur);
    kok.addEventListener('mouseleave', function () { if (!elle) basla(); });
    kok.addEventListener('focusin', dur);
    kok.addEventListener('focusout', function () {
      if (!kok.contains(document.activeElement) && !elle) basla();
    });

    /* Sekme arkaya alınınca sayaç da çizim de duruyor */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        dur();
        if (gecisAnim) { cancelAnimationFrame(gecisAnim); gecisAnim = null; cizimSurer = false; }
      } else if (!elle) basla();
    });

    window.addEventListener('resize', function () {
      if (gl && !cizimSurer) ciz(0, i, i);
    });

    /* Görünürken çalış, görünmezken dur */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (!elle) basla(); }
          else dur();
        });
      }, { threshold: 0.25 }).observe(kok);
    } else {
      basla();
    }

    /* Önce bağlam, sonra dokular: dokuYap() gl'i kullanıyor, sıra tersine
       dönerse null üzerinde createTexture çağrılır. Görseller henüz
       yüklenmediyse `load` olayında yeniden deneniyor.
       Herhangi bir adım tökezlerse CSS daire açılımı geçişi taşımaya devam
       ediyor — slayt hiçbir durumda kırık kalmıyor. */
    function hazirla() {
      var imgler = kareler.map(function (k) { return k.querySelector('img'); });
      var gorselHazir = imgler.every(function (im) { return im && im.complete && im.naturalWidth; });
      if (!gorselHazir) return false;
      if (!webglKur()) { gl = null; return true; }
      if (!dokulariYukle()) { gl = null; return true; }
      kok.setAttribute('data-webgl', 'evet');
      ciz(0, i, i);
      return true;
    }
    if (!hazirla()) {
      window.addEventListener('load', hazirla, { once: true });
    }
  });


  /* --- Akordeon (etkinlik atölye kategorileri) ---------------------------
     Birden fazla panel aynı anda açık kalabiliyor: kullanıcı iki kategoriyi
     karşılaştırmak isteyebilir, açtığını kapatmak onun kararı.
     Yükseklik CSS'te 0fr → 1fr ile çözülüyor; burada yalnızca durum var. */
  document.querySelectorAll('[data-akordeon]').forEach(function (kutu) {
    var ogeler = [].slice.call(kutu.querySelectorAll('.akordeon-oge'));
    var dugmeler = ogeler.map(function (o) { return o.querySelector('.akordeon-dugme'); });

    function ayarla(oge, ac) {
      oge.setAttribute('data-acik', ac ? 'true' : 'false');
      oge.querySelector('.akordeon-dugme').setAttribute('aria-expanded', ac ? 'true' : 'false');
    }

    dugmeler.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var oge = ogeler[i];
        ayarla(oge, oge.getAttribute('data-acik') !== 'true');
      });

      /* Klavye: başlıklar arasında ok tuşlarıyla gezinme —
         WAI-ARIA akordeon deseninin beklediği davranış. */
      btn.addEventListener('keydown', function (e) {
        var hedef = null;
        if (e.key === 'ArrowDown') hedef = dugmeler[(i + 1) % dugmeler.length];
        else if (e.key === 'ArrowUp') hedef = dugmeler[(i - 1 + dugmeler.length) % dugmeler.length];
        else if (e.key === 'Home') hedef = dugmeler[0];
        else if (e.key === 'End') hedef = dugmeler[dugmeler.length - 1];
        if (!hedef) return;
        e.preventDefault();
        hedef.focus();
      });
    });

    /* Kapalı bir panelin içindeki bağlantıya adresten gelinirse panel açılır.
       Ayrıca panel içinden bir öğe odak alırsa (Ctrl+F sonrası sekme gibi)
       kapalı kalmasın. */
    kutu.addEventListener('focusin', function (e) {
      var oge = e.target.closest('.akordeon-oge');
      if (oge && !e.target.closest('.akordeon-dugme')) ayarla(oge, true);
    });
  });


  /* --- Panel şeridi: sahne değiştirme -------------------------------------
     Referans (naregitim.com/cozumlerimiz) panele gelince arka plandaki
     görselin tamamını değiştiriyor. Aynı davranış:

       · fare panelin üzerine gelince o panelin karesi görünür olur
       · klavyeyle odaklanınca da aynı şey olur (fare zorunlu değil)
       · şeritten çıkınca ilk kareye dönülür

     Görselin panelin ARKASINDA olmasının sebebi ölçüm: panelin İÇİNDE
     olduğu sürümde 195×400 piksellik dar çerçevede 3:2 fotoğrafın %68'i
     kesiliyordu. Tam genişlikte tek çerçevede kayıp ~%10.

     900 pikselin altında CSS sahneyi kapatıp ızgaraya geçiyor; orada her
     panel kendi zeminini gösterdiği için bu kod boşa çalışmasın diye
     `matchMedia` ile susuyor. */
  document.querySelectorAll('[data-pserit]').forEach(function (serit) {
    var kareler = [].slice.call(serit.querySelectorAll('.pserit-kare'));
    var paneller = [].slice.call(serit.querySelectorAll('.pserit-panel'));
    if (kareler.length < 2 || !paneller.length) return;

    var dar = window.matchMedia('(max-width: 900px)');
    var aktif = 0;

    function goster(i) {
      if (dar.matches || i === aktif) return;
      if (kareler[aktif]) kareler[aktif].classList.remove('is-aktif');
      if (kareler[i]) kareler[i].classList.add('is-aktif');
      aktif = i;
    }

    paneller.forEach(function (panel, i) {
      panel.addEventListener('mouseenter', function () { goster(i); });
      panel.addEventListener('focus', function () { goster(i); });
    });

    /* Şeritten tamamen çıkınca başa dön. `mouseleave` şeridin kendisinde
       dinleniyor: paneller arası geçişte tetiklenmesin. */
    serit.addEventListener('mouseleave', function () { goster(0); });
    serit.addEventListener('focusout', function (e) {
      if (!serit.contains(e.relatedTarget)) goster(0);
    });
  });


  /* METODOLOJİ — üç evre kartı.

     Kart yerinde açılıyor: komşular kaymıyor, sayfa uzamıyor. Tek
     seferde bir kart açık; ikincisine tıklayınca birincisi kapanıyor,
     yoksa üç kart birden açılıp bölüm iki ekrana çıkıyor.

     Yükseklik animasyonu CSS'te `grid-template-rows: 0fr → 1fr` ile;
     burada yalnız durum değişiyor. `max-height` tahmini kullanılmıyor,
     uzun metinde kırpıyor.

     Arkadaki gövde çizgisi bölüm görününce doluyor — "büyüme" fikri. */
  document.querySelectorAll('.mtd').forEach(function (liste) {
    var kartlar = [].slice.call(liste.querySelectorAll('.mtd-kart'));
    if (!kartlar.length) return;

    kartlar.forEach(function (kart) {
      var dugme = kart.querySelector('.mtd-ac');
      if (!dugme) return;
      dugme.addEventListener('click', function () {
        var acik = kart.getAttribute('data-acik') === 'evet';
        kartlar.forEach(function (k) {
          k.removeAttribute('data-acik');
          var d = k.querySelector('.mtd-ac');
          if (d) d.setAttribute('aria-expanded', 'false');
        });
        if (!acik) {
          kart.setAttribute('data-acik', 'evet');
          dugme.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* Yüzde eşiği KULLANMA: ekrandan uzun bölümde hiç tetiklenmez.
       `threshold: 0` + rootMargin doğru olan. */
    if ('IntersectionObserver' in window) {
      var gozcu = new IntersectionObserver(function (girisler) {
        girisler.forEach(function (g) {
          if (g.isIntersecting) {
            liste.setAttribute('data-doldu', 'evet');
            gozcu.disconnect();
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
      gozcu.observe(liste);
    } else {
      liste.setAttribute('data-doldu', 'evet');
    }
  });

})();
