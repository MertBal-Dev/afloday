/* ==========================================================================
   AFLODAY — PALET, TEK KAYNAK
   --------------------------------------------------------------------------
   Sitedeki her renk buradan çıkar. CSS'te ham hex yazılmaz, `:root` bloğu
   bu dosyadan üretilir (bkz. `paletCss`).

   Token adları ROLÜ anlatır, rengi değil. Bir dönem `--carmine` adlı
   değişken turuncu, `--bronze` adlı değişken haki tutuyordu; palet üç kez
   üst üste yamandığı için isimler yalan söyler hâle gelmişti. Rol adı
   bunu imkânsız kılar: `--eylem` hangi renge çevrilirse çevrilsin eylem
   rengidir.

   Bu dosya aynı zamanda Ceylan hanımın renk panelinin çıktı biçimidir.
   Panel "kaydet" dediğinde üreteceği şey tam olarak aşağıdaki nesnedir.

   KURALLAR — kaynağı Ceylan hanım, 5 Ağustos geri bildirimi:
   · "yeni renk turuncu, yeşil. Ağırlıkta yeşil kullanabiliriz."
   · Turuncu ASLA metin rengi olamaz: krem üzerinde 2.84:1, küçük metin
     için 4.5, iri metin için 3.0 eşiğini de geçmiyor. Koyu bantta serbest
     (5.11:1). Metin vurgusu daima yeşil.
   · Odak halkası ayrı token: tek değerle hem krem hem koyu zeminde 3:1
     geçmesi gerekiyor, bunu yapan tek ton #C6401A.
   ========================================================================== */

export const palet = {
  /* --- yüzeyler --- */
  zemin:      '#EBE7DB',   /* sayfa zemini. Kâğıt tonu: R>G>B rampası, ton 91.6 */
  yuzey:      '#F4F1E7',   /* kart, panel, açık yüzey */
  yuzeyKoyu:  '#E0DBCB',   /* ikinci kademe yüzey */
  yuzeyParlak:'#FBFAF3',   /* en açık yüzey, form alanları */

  /* --- metin --- */
  murekkep:   '#141C17',   /* gövde metni. Zemin üzerinde 14.06:1 */
  soluk:      '#5C6158',   /* ikincil metin, açıklama. 5.14:1 */
  etiket:     '#6B6340',   /* göz kırpma, etiket. Logonun harf rengi, 4.88:1 */

  /* --- eylem --- */
  eylem:      '#131A15',   /* düğme zemini, mürekkep. Krem yazıyla 15.8:1 */
  eylemUst:   '#F4F3EC',   /* düğme yazısı */
  eylemHover: '#2A3A2D',   /* düğme üzerine gelince */

  /* --- vurgu --- */
  vurgu:      '#2F6A2E',   /* italik başlık, kart çizgisi, ok, bağlantı. 5.27:1 */
  vurguCanli: '#428840',   /* iri italik serif, 38px üstü. 3.56:1 iri metin eşiği */
  turuncu:    '#F05625',   /* logonun turuncusu. YALNIZ zemin ve koyu bant. */
  turuncuKoyu:'#D8481B',   /* turuncu zeminin hover hâli */
  haki:       '#958A54',   /* logonun Pantone hakisi. Koyu bantta etiket, 5.09:1 */

  /* --- odak --- */
  odak:       '#C6401A',   /* odak halkası. Krem 4.09:1 · koyu 3.50:1 */

  /* --- çizgiler --- */
  cizgi:      '#CFC9B9',
  cizgiSoluk: '#DFDACB',

  /* --- koyu bant --- */
  bant:       '#131A15',   /* koyu bant zemini */
  bant2:      '#1B241D',   /* bant içinde ikinci kademe */
  bantCizgi:  '#2C382F',
  bantYazi:   '#E9E9E0',   /* koyu bantta gövde metni */
  bantSoluk:  '#A2AA9F',   /* koyu bantta ikincil metin */
  bantVurgu:  '#7FB877',   /* koyu bantta italik vurgu. Yeşil orada 1.9:1 ile kayboluyor */
  bantTuruncu:'#F2764A',   /* koyu bantta turuncu, 6.29:1 */

  /* --- video ve alt bilgi: koyu görsel üzerindeki metin --- */
  heroYazi:   '#D6DAD3',   /* sinematik kapakta giriş cümlesi */
  heroYazi2:  '#D5D9D2',   /* açılış bölümünde aynı iş, bir tık farklı ton */
  ftrYazi:    '#C4C9C1',   /* alt bilgi bağlantısı ve adres */
  ftrEtiket:  '#7F877D',   /* alt bilgi etiketi, küçük punto */
  beyaz:      '#FFF',      /* seçim vurgusu, koyu zemin üstü saf beyaz */
};

/* --------------------------------------------------------------------------
   Eski token adları. CSS'te 500'den fazla `var()` çağrısı bunlara bakıyor;
   hepsini tek seferde yeniden adlandırmak yerine takma ad olarak veriliyor.
   Aşama 1'de yerleşim motoru yazılırken çağrılar kademeli olarak yeni
   adlara taşınacak, sonra bu tablo silinecek.

   Not: `--carmine` bir dönem turuncu tutuyordu ama düğmeler son hâlde
   mürekkebe geçti (satır 3964 kazanıyordu). Takma ad efektif değere
   bağlanıyor, eski ara katmanlara değil.
   -------------------------------------------------------------------------- */
export const takmaAdlar = {
  '--mount':        'zemin',
  '--plate':        'yuzey',
  '--plate-deep':   'yuzeyKoyu',
  '--ink':          'murekkep',
  '--ink-muted':    'soluk',
  '--bronze':       'etiket',
  '--bronze-lift':  'bantSoluk',
  '--carmine':      'turuncu',
  '--carmine-deep': 'turuncuKoyu',
  '--carmine-soft': 'bantTuruncu',
  '--rule':         'cizgi',
  '--rule-soft':    'cizgiSoluk',
  '--field':        'bant',
  '--field-2':      'bant2',
  '--field-rule':   'bantCizgi',
  '--field-ink':    'bantYazi',
  '--field-muted':  'bantSoluk',
  '--yesil':        'vurguCanli',
  '--yesil-derin':  'vurgu',
};
/* `--vurgu`, `--turuncu`, `--odak`, `--haki` zaten rol adıyla aynı; takma
   ad verilirse kendine referans olur ve CSS özelliği geçersiz sayar. */

/* camelCase → --kebab-case */
const kebap = (s) => '--' + s.replace(/[A-Z]/g, (h) => '-' + h.toLowerCase());

/** `:root` bloğunun renk kısmını üretir. CSS'e elle hex yazılmaz. */
export function paletCss() {
  const satirlar = [];
  satirlar.push('  /* Renkler `_build/palet.mjs`den üretiliyor. Elle değiştirme. */');
  for (const [ad, deger] of Object.entries(palet)) {
    satirlar.push(`  ${(kebap(ad) + ':').padEnd(16)} ${deger};`);
  }
  satirlar.push('');
  satirlar.push('  /* Eski adlar — Aşama 1de kaldırılacak takma adlar. */');
  for (const [eski, yeni] of Object.entries(takmaAdlar)) {
    satirlar.push(`  ${(eski + ':').padEnd(16)} var(${kebap(yeni)});`);
  }
  return satirlar.join('\n');
}

/** Panelin üreteceği biçim: doğrudan bu dosyanın gövdesi. */
export function paletKaynagi(yeni = palet) {
  const satir = Object.entries(yeni)
    .map(([k, v]) => `  ${(k + ':').padEnd(12)} '${v}',`).join('\n');
  return `export const palet = {\n${satir}\n};\n`;
}
