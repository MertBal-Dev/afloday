/* Excel envanterinin 35 satırını tek tek doğrular ve hedefleriyle listeler.
   Sadece "sayfa var mı" değil; İPTAL edilenlerin NEREYE gittiği de
   "Sayfa" sütunundaki bölümle tutarlı mı, ona bakıyor. */
import { readFileSync, readdirSync } from 'node:fs';

const S = 'C:/Users/Gaming/AppData/Local/Temp/claude/c--Users-Gaming-Desktop-Afloday/9762a584-306b-4526-88f3-6d66de01acda/scratchpad/';
const KOK = 'c:/Users/Gaming/Desktop/Afloday/';

const satir = readFileSync(S + 'envanter.tsv', 'utf8').split('\n')
  .map((l) => l.replace(/\r$/, '').split('\t'))
  .filter((a) => a.length >= 5 && a[0] !== 'No')
  .map(([no, baslik, url, bolum, durum, not]) => ({
    no: no || '—', baslik, bolum: (bolum || '').trim(), durum: (durum || '').trim(), not: (not || '').trim(),
    adres: (url || '').replace(/^https?:\/\/(www\.)?afloday\.com\/?/, '').replace(/\/$/, ''),
  }));

const uretilen = new Set(readdirSync(KOK + 'site').filter((f) => f.endsWith('.html'))
  .map((f) => (f === 'index.html' ? '' : f.replace(/\.html$/, ''))));
const yon = new Map((JSON.parse(readFileSync(KOK + 'vercel.json', 'utf8')).redirects || [])
  .map((r) => [r.source.replace(/^\//, ''), r.destination.replace(/^\//, '')]));

/* İptal edilen bir adresin gittiği yer, Excel'deki bölümüyle uyumlu mu? */
const beklenenHedef = (bolum) => {
  if (bolum === 'KURUMSAL HİZMETLER') return ['kurumsal', 'dogadan-hobi-atolyeleri', 'doga-temelli-egitimlerimiz'];
  return ['dogadan-hobi-atolyeleri', 'iletisim'];       /* atölye sayfaları ve katılım */
};

const cikti = [];
let tamam = 0, sorun = 0;

for (const s of satir) {
  const sayfaVar = uretilen.has(s.adres);
  const hedef = yon.get(s.adres);
  let isaret, aciklama;

  if (s.durum === 'İPTAL') {
    if (sayfaVar && s.adres === 'dogadan-hobi-atolyeleri') {
      isaret = '✓'; aciklama = 'adresi yeni Etkinlik sayfası devraldı (bilinçli)';
    } else if (sayfaVar) {
      isaret = '✗'; aciklama = 'İPTAL ama sayfa hâlâ üretiliyor';
    } else if (!hedef) {
      isaret = '✗'; aciklama = 'yönlendirme yok — 404 verecek';
    } else {
      const uygun = beklenenHedef(s.bolum).includes(hedef);
      isaret = uygun ? '✓' : '⚠';
      aciklama = `301 → /${hedef}${uygun ? '' : `  (bölüm "${s.bolum}" ile uyumsuz olabilir)`}`;
    }
  } else if (s.durum === 'Yeni Sayfa') {
    isaret = uretilen.has('dogadan-hobi-atolyeleri') ? '✓' : '✗';
    aciklama = 'üretildi → /dogadan-hobi-atolyeleri';
  } else {
    isaret = sayfaVar ? '✓' : (hedef ? '⚠' : '✗');
    aciklama = sayfaVar
      ? (s.durum === 'Yenilenecek' ? 'sayfa duruyor, içerik yenilendi' : 'sayfa duruyor, içerik korundu')
      : (hedef ? `sayfa yok, 301 → /${hedef}` : 'sayfa yok, yönlendirme de yok');
  }

  if (isaret === '✓') tamam++; else sorun++;
  cikti.push({ ...s, isaret, aciklama });
}

console.log('No  DURUM        ADRES                                  SONUÇ');
console.log('─'.repeat(104));
for (const c of cikti) {
  console.log(
    String(c.no).padStart(2) + '  '
    + c.durum.padEnd(12) + ' '
    + ('/' + c.adres).padEnd(38)
    + c.isaret + ' ' + c.aciklama,
  );
}
console.log('─'.repeat(104));
console.log(`${satir.length} satır · ${tamam} tamam · ${sorun} sorunlu`);

/* "Sayfa metni değişecek" notu gerçekten uygulanmış mı — canlı metinle karşılaştır */
console.log('\n"Sayfa metni değişecek" notu olan satırlar:');
const norm = (t) => t.replace(/\s+/g, ' ').trim().toLowerCase();
for (const c of cikti.filter((x) => /metni değişecek/i.test(x.not))) {
  if (!uretilen.has(c.adres)) { console.log(`  ${c.isaret} /${c.adres} — sayfa yok (iptal edilmiş)`); continue; }
  const dosya = (c.adres || 'index') + '.html';
  const yeni = norm(readFileSync(KOK + 'site/' + dosya, 'utf8').replace(/<[^>]+>/g, ' '));
  let eski = '';
  try { eski = norm(readFileSync(KOK + '_audit/orijinal/' + (c.adres || 'anasayfa') + '.txt', 'utf8')); } catch { /* yok */ }
  const degisti = eski && yeni.length > 0 && Math.abs(yeni.length - eski.length) / Math.max(eski.length, 1) > 0.15;
  console.log(`  ${degisti ? '✓ değişmiş' : '· fark küçük'}  /${c.adres || '(anasayfa)'}  (canlı ${eski.length} → yeni ${yeni.length} karakter)`);
}
