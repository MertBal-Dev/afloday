/* Sayfa düzeni denetimi — tarayıcıda çalışır, yalnızca SORUNLARI döndürür.
   Kullanım: browser_evaluate ile bu fonksiyonun gövdesi çağrılır. */
window.__auditLayout = async function () {
  // Görsellerin ve yazı tiplerinin oturmasını bekle
  document.querySelectorAll('img[loading="lazy"]').forEach(i => (i.loading = 'eager'));
  document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  await new Promise(r => setTimeout(r, 1600));

  const problems = [];
  const add = (tur, detay) => problems.push(`${tur}: ${detay}`);
  const tag = el => {
    const c = (el.className || '').toString().trim().split(/\s+/)[0];
    return el.tagName.toLowerCase() + (c ? '.' + c : '') + (el.id ? '#' + el.id : '');
  };

  /* 1. Yatay taşma */
  const de = document.documentElement;
  if (de.scrollWidth > window.innerWidth + 1) {
    add('YATAY TAŞMA', `${de.scrollWidth}px > ${window.innerWidth}px`);
    // Suçluyu bul
    document.querySelectorAll('body *').forEach(el => {
      const b = el.getBoundingClientRect();
      if (b.width === 0) return;
      if (b.right > window.innerWidth + 2 || b.left < -2) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') return;
        add('  taşıran', `${tag(el)} (${Math.round(b.left)}→${Math.round(b.right)})`);
      }
    });
  }

  /* 2. Kırık ya da yüklenmemiş görseller */
  document.querySelectorAll('img').forEach(i => {
    if (i.complete && i.naturalWidth === 0) add('KIRIK GÖRSEL', i.getAttribute('src'));
  });

  /* 3. Metin kabına sığmıyor (dikey taşma) */
  document.querySelectorAll('h1,h2,h3,p,li,dd,dt,span,a,button').forEach(el => {
    if (el.children.length) return;
    if (el.classList.contains('sr-only')) return;   // kasten kırpılır
    const cs = getComputedStyle(el);
    if (cs.overflow === 'hidden' && el.scrollHeight > el.clientHeight + 4 && el.clientHeight > 0) {
      add('METİN KESİLİYOR', `${tag(el)} "${(el.textContent || '').trim().slice(0, 32)}"`);
    }
  });

  /* Gizli bir atanın içinde mi? (display:none / visibility:hidden alt ağacı) */
  const gizli = el => el.offsetParent === null && getComputedStyle(el).position !== 'fixed';

  /* 4. Görünür ama sıfır yükseklikli kaplar (çökmüş bölüm) */
  document.querySelectorAll('section, .wrap > div, .plate, .ledger-row').forEach(el => {
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || gizli(el)) return;
    if (b.height < 2 && (el.textContent || '').trim().length > 0) {
      add('ÇÖKMÜŞ KAP', `${tag(el)}`);
    }
  });

  /* 5. Çok dar kalmış sütun (kırılmış grid) */
  document.querySelectorAll('.hero-video-copy, .folio-grid > *, .split > *, .duo > *, .opener > *').forEach(el => {
    const b = el.getBoundingClientRect();
    if (b.width > 0 && b.width < 150 && (el.textContent || '').trim().length > 40) {
      add('SÜTUN ÇOK DAR', `${tag(el)} ${Math.round(b.width)}px`);
    }
  });

  /* 6. Kenara yapışmış içerik (gutter kaybı) */
  const gut = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter')) || 20;
  document.querySelectorAll('.wrap > *').forEach(el => {
    const b = el.getBoundingClientRect();
    if (b.width > 0 && b.left < 4) add('KENARA YAPIŞIK', `${tag(el)} left=${Math.round(b.left)}`);
  });

  /* 7. Üst üste binen kardeş bloklar */
  const blocks = [...document.querySelectorAll('.hero-video-copy, .hero-video-media, .plate, .ledger-row')];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i].getBoundingClientRect(), b = blocks[j].getBoundingClientRect();
      if (a.width < 2 || b.width < 2) continue;
      if (blocks[i].contains(blocks[j]) || blocks[j].contains(blocks[i])) continue;
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 8 && oy > 8) add('BLOK ÇAKIŞMASI', `${tag(blocks[i])} ↔ ${tag(blocks[j])}`);
    }
  }

  /* 8. Boş görünen bölümler (çok az içerik, çok fazla yükseklik) */
  document.querySelectorAll('main > section').forEach(el => {
    const b = el.getBoundingClientRect();
    const txt = (el.textContent || '').trim().length;
    const img = el.querySelectorAll('img,video').length;
    if (b.height > 400 && txt < 40 && img === 0) {
      add('BOŞ BÖLÜM', `${tag(el)} ${Math.round(b.height)}px yükseklik, ${txt} karakter`);
    }
  });

  /* 9. Tıklanabilir alan çok küçük (dokunma hedefi) */
  if (window.innerWidth < 900) {
    document.querySelectorAll('a, button').forEach(el => {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0 || gizli(el)) return;
      if (b.height < 28 && (el.textContent || '').trim().length > 0) {
        add('DOKUNMA HEDEFİ KÜÇÜK', `${tag(el)} ${Math.round(b.height)}px`);
      }
    });
  }

  return {
    sayfa: location.pathname.split('/').pop(),
    genislik: window.innerWidth,
    sorunSayisi: problems.length,
    sorunlar: [...new Set(problems)].slice(0, 24),
  };
};
