/* Belgenin bir bölümünü tek tek satır olarak ilgili sayfayla karşılaştırır.
   Kullanım: node bolum.mjs <ilkSatir> <sonSatir> <sayfa.html> [sayfa2.html ...]

   Neden satır satır: toplu oran ölçmek eksik cümleyi gizliyor. Burada her
   satır ayrı sonuç veriyor, VAR/YOK olarak.

   Eşleştirme gevşek: belge ile site arasında noktalama ve tırnak biçimi
   değişiyor (belge “…”, site &ldquo;…). Hepsi boşluğa indiriliyor.

   Belge bize yönerge de yazıyor ("Görsel Önerisi:", "ÖRNEK TASARIM
   aşağıdadır"). Bunlar sayfaya girmez, YÖNERGE olarak ayrılıyor. */
import { readFileSync, readdirSync } from 'node:fs';

const S = 'C:/Users/Gaming/AppData/Local/Temp/claude/c--Users-Gaming-Desktop-Afloday/9762a584-306b-4526-88f3-6d66de01acda/scratchpad/';
const SITE = 'c:/Users/Gaming/Desktop/Afloday/site/';

const norm = (s) => s
  .replace(/&ldquo;|&rdquo;|&quot;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, ' ')
  .replace(/[“”"'’·—–;:,()&①②③④⑤⑥⑦•\[\]]/g, ' ')
  .replace(/\s+/g, ' ').trim().toLowerCase();

/* JS'in /i/ bayrağı Türkçe İ/ı ile çalışmıyor: "İkincil".toUpperCase() → "İ",
   "i".toUpperCase() → "I", eşleşmiyor. Bu yüzden desenleri kendimiz
   küçültüyoruz — Türkçe harfleri açıkça eşliyoruz. */
const kucult = (s) => s
  .replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü')
  .replace(/Ş/g, 'ş').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();

/* Belgenin kendi yapı satırları — siteye girmesi beklenmeyenler */
const YONERGE = /^(\d+\s*[.)]?\s*(hero|değer|eğitim|doğadan|sayfa)|\d*\.?\s*görsel öner|örnek tasarım|taslak içerik|görsel yönü|web sitesinde|pdf'teki|not\s*[::]|ana sayfa açılışı|öne çıkan|anasayfa metinleri|sayfa akışı|akordeon menü|\[tablo|=====|whatsapp image|resim\d*$)/;
/* "Etiket: metin" biçimindeki satırlarda etiket ayıklanır */
const ETIKET = /^(üst etiket|ana başlık|alt başlık|birincil buton|ikincil buton|buton|başlık|eyebrow|h1|h2|h3|cta|anlatı|ne sunuyoruz)\s*(\([^)]*\))?\s*[::]\s*/;

const [, , a, b, ...dosyalar] = process.argv;
const ilk = Number(a), son = Number(b);

const belge = readFileSync(S + 'belge-tam.txt', 'utf8').split('\n');
const hedefler = dosyalar.length ? dosyalar : readdirSync(SITE).filter((f) => f.endsWith('.html'));
const metin = {};
for (const f of hedefler) metin[f] = norm(readFileSync(SITE + f, 'utf8').replace(/<[^>]+>/g, ' '));

let varSay = 0, yokSay = 0, yonergeSay = 0;
const eksikler = [];

for (let i = ilk; i <= son && i <= belge.length; i++) {
  const ham = (belge[i - 1] || '').trim();
  if (!ham || ham.split(' ').length < 3) continue;

  const kucuk = kucult(ham);
  if (YONERGE.test(kucuk)) { yonergeSay++; continue; }

  /* Hücre satırları iki alanı `/` ile birleştiriyor: yarımları ayrı ara.
     Hücreler Excel'in satır etiketleri ("Hero'nun Hemen Altı — 3 Sütun"),
     yani bize nereye koyacağımızı söylüyorlar; sayfa metni değiller. */
  if (ham.startsWith('[HÜCRE]')) { yonergeSay++; continue; }
  const etiketSiz = kucult(ham).replace(ETIKET, '');
  const parcalar = [etiketSiz === kucuk ? ham : ham.slice(ham.length - etiketSiz.length)];

  for (const p of parcalar) {
    const k = norm(p);
    if (k.split(' ').length < 3) continue;
    const iz = k.slice(0, Math.min(k.length, 60));
    const nerede = hedefler.filter((f) => metin[f].includes(iz));
    if (nerede.length) { varSay++; } else { yokSay++; eksikler.push([i, p.trim()]); }
  }
}

console.log(`SATIR ${ilk}-${son}  ·  hedef: ${dosyalar.join(', ') || 'tüm sayfalar'}`);
console.log(`  VAR ${varSay}  ·  YOK ${yokSay}  ·  yönerge ${yonergeSay}\n`);
if (eksikler.length) {
  console.log('KARŞILIKSIZ SATIRLAR:');
  for (const [n, s] of eksikler) console.log(`  ${String(n).padStart(3)} │ ${s.slice(0, 155)}`);
} else {
  console.log('✓ Bu bölümün her içerik satırı sayfada geçiyor.');
}
