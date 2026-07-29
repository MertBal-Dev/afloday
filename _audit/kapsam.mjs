/* İÇERİK KAPSAM DENETİMİ
   afloday.com'un her sayfasındaki her cümleyi alır ve bizim sitede
   geçip geçmediğine bakar. Amaç: hiçbir orijinal cümle kaybolmasın. */
import { readFileSync, readdirSync } from 'node:fs';

const GOVDE = new URL('./govde/', import.meta.url);
const SITE = new URL('../site/', import.meta.url);

/* Sitemizin tüm metnini tek havuza topla */
let havuz = '';
for (const f of readdirSync(SITE).filter(x => x.endsWith('.html'))) {
  let h = readFileSync(new URL(f, SITE), 'utf8');
  h = h.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ');
  havuz += ' ' + h;
}

/* Karşılaştırma için normalize: küçük harf, tırnak/tire birleştir, boşluk sadeleştir */
const norm = (t) => t
  .replace(/&nbsp;|&#\d+;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/&rsquo;|&#39;/g, "'")
  .replace(/[“”„»«]/g, '"').replace(/[’‘`´]/g, "'").replace(/[–—−]/g, '-')
  .replace(/\s+/g, ' ')
  .toLocaleLowerCase('tr');

const H = norm(havuz);

/* Kabuk satırları (menü, footer) zaten her sayfada — denetim dışı */
const KABUK = /^(anasayfa|hakkımızda|ekibimiz|kurumsal hizmetler|iletişim|referanslarımız|atölye katılımı|insan kaynakları|doğa temelli eğitimlerimiz|sürdürülebilirlik|doğadan hobi atölyeleri|invalid input|0\/500|lütfen |e\-posta adresinizi|cv yükle|desteklenen formatlar)/i;

/* Sayfa <title> satırları ("X | Afloday") ve menüde tekrarlanan atölye adları
   içerik değil kabuktur — denetim dışı. */
const BASLIK = /\|\s*(Afloday|Sosyal Sorumluluk)\s*$/i;
const MENU_ATOLYE = /^(Mini Kavanoz Teraryum|Mini Bahçe|Kuş Evi Tasarım|Kalemlik Tasarım|Doğa Çerçeve|Mevsim Kapı Çelengi|Kuru Çiçek Fanus|Çiçek Aksesuar|Doğal Tütsü|Taze Çiçek Buket|Çiçek Çerçeve|Kokedama|Minyatür Bahçe|Sukulent Aranjman|Kavanoz Teraryum)[^.]*\(?\+?\d?\s?y?a?ş?\)?$/;

/* "Atölye Kazanımları: A, B, C" gibi virgüllü listeler bizde tek tek rozet olarak
   duruyor — satırın tamamı değil, her maddesi aranır. */
function listeMi(c) { return /^(Atölye|Atölyenin) Kazanımları:/i.test(c); }
function listeTam(c, H) {
  return c.replace(/^[^:]*:/, '').split(',').map(x => x.trim()).filter(Boolean)
    .every(x => H.includes(norm(x)));
}

let toplam = 0, eksik = [], kismi = [];
for (const f of readdirSync(GOVDE).filter(x => x.endsWith('.txt'))) {
  const sayfa = f.slice(0, -4);
  const satirlar = readFileSync(new URL(f, GOVDE), 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
  for (const satir of satirlar) {
    if (satir.length < 25) continue;             // başlık/etiket
    if (KABUK.test(satir) || BASLIK.test(satir) || MENU_ATOLYE.test(satir)) continue;
    if (listeMi(satir)) { toplam++; if (!listeTam(satir, H)) eksik.push([sayfa, satir]); continue; }
    // Satırı cümlelere böl; uzun paragraflarda cümle bazlı kontrol daha hassas
    const cumleler = satir.split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9“"])/).filter(c => c.length >= 30);
    for (const c of (cumleler.length ? cumleler : [satir])) {
      toplam++;
      const n = norm(c);
      if (H.includes(n)) continue;
      // Tam eşleşme yoksa: cümlenin ilk 9 kelimesi geçiyor mu?
      const bas = n.split(' ').slice(0, 9).join(' ');
      if (bas.length > 30 && H.includes(bas)) { kismi.push([sayfa, c]); continue; }
      eksik.push([sayfa, c]);
    }
  }
}

const yuzde = (x) => ((x / toplam) * 100).toFixed(1);
console.log(`Orijinal cümle: ${toplam}`);
console.log(`  ✓ birebir geçiyor : ${toplam - eksik.length - kismi.length} (%${yuzde(toplam - eksik.length - kismi.length)})`);
console.log(`  ~ kısmen geçiyor  : ${kismi.length} (%${yuzde(kismi.length)})`);
console.log(`  ✗ hiç geçmiyor    : ${eksik.length} (%${yuzde(eksik.length)})\n`);

if (kismi.length) {
  console.log('— KISMEN (başı tutuyor, sonu farklı) —');
  for (const [s, c] of kismi) console.log(`  [${s}] ${c.slice(0, 120)}`);
  console.log();
}
if (eksik.length) {
  console.log('— EKSİK —');
  for (const [s, c] of eksik) console.log(`  [${s}] ${c.slice(0, 150)}`);
}
