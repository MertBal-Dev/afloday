# Afloday — proje hafızası

> **Yeni oturumdaysan sırayla oku:**
> 1. Bu dosya (tamamı)
> 2. `docs/devam-plani.md` — nerede kaldık, sırada ne var
> 3. `docs/belge-kapsam-raporu.md` — belge doğrulamasının kanıtı
>
> Son güncelleme: 6 Ağustos 2026.
> Site yayında: **afloday.vercel.app** (henüz afloday.com değil)
>
> **DİKKAT — hangi dalda olduğuna bak.** Ceylan hanımın 5 Ağustos geri
> bildirimi `feedback-2026-08-06` dalında uygulandı; `main` hâlâ geri
> bildirim öncesi hâlde (`4b9ea9c`) ve yayındaki site o. Çalışmaya devam
> etmeden önce: `git checkout feedback-2026-08-06`

---

## Bir bakışta

```
Müşteri      Afloday · Ceylan Kalyon Özdemir (kurucu, kurumsal iletişim)
Teknik kişi  Hasan Basri Ünlü (Afloday tarafı)
Geliştirici  İsmail Mert Bal (serbest)
Bedel        20.000 TL KDV dahil · site + blog + panel, tek paket
Fatura       tek fatura, site yayına alındığında
Bakım        ilk 3 ay dahil · 3. ay sonunda yıllık bedel konuşulacak
Teslim       site: cPanel erişiminden 3-4 iş günü · blog+panel: en geç 3 hafta
Durum        Geri bildirim turu uygulandı, Ceylan hanıma gönderilmeyi
             bekliyor. Blog + panel başlamadı.
```

## Yeni bilgisayarda başlarken

```bash
git clone https://github.com/MertBal-Dev/afloday.git
cd afloday
git checkout feedback-2026-08-06     # ← ÖNEMLİ, main eski hâlde
npm install
```

Sonra `.env` dosyasını elle oluştur — depoda yok, iki satır:

```
SITE_URL=https://afloday.vercel.app
PREVIEW=1
```

`PREVIEW=1` sayfalara `noindex` ve `robots.txt`'ye `Disallow: /` koyuyor.
**Gerçek yayına geçerken bu satır silinecek**, yoksa Google siteyi indekslemez.

Doğrula:

```bash
node _build/build.mjs && node _build/verify.mjs   # 0 sorun vermeli
npm run build                                     # üretim derlemesi
```

**Zip'e gerek yok.** `.env` (2 satır) ve `node_modules` (npm install üretir)
dışında her şey depoda: kaynak belgeler `docs/kaynak/`, marka dosyaları
`docs/marka/`, denetim betikleri `_audit/denetim/`.

**Fiyat pazarlığı kapandı, bir daha açma.** Kapsam belgede ne yazıyorsa o.

---

## Kurallar — ve hangisinin kaynağı var

Bu ayrım önemli. Bir dönem `CLAUDE.md`'de "tasarım dili" kural olarak yazılıydı
ama kaynağı yoktu; geliştiricinin tercihiydi ve kullanıcıya kural gibi
sunulmuştu. **Kural yazarken kaynağını da yaz.**

| Kural | Kaynak | Bağlayıcı mı |
|---|---|---|
| **İçerik uydurma yasak** | Kullanıcı, açıkça iki kez | ✅ evet |
| **Sormadan commit/push yok** | Kullanıcı | ✅ evet (nota bak) |
| **34 canlı adres korunacak** | Excel envanteri, DURUM sütunu | ✅ evet |
| Tailwind kurulmayacak | Mimari karar, `docs/mimari.md` | ⚙️ gerekçeli teknik tercih |
| Saç teli çizgi, serif başlık | — | ⚠️ **tercih**, kural değil |
| **Yeni palet: ağırlıkta yeşil, turuncu vurgu** | Ceylan hanım, 5 Ağustos | ✅ evet |

**Palet notu — üç turda oturdu, sonuncusu geçerli.**

Karmen `#A82B45` ve bronz `#7D5F31` kalktı; ikisi de logoda yok, uydurma
renkti. Yeni değerler logonun Pantone'larından (`docs/marka/Pant1-3.png`):
turuncu `#F05625`, yeşil `#428840`, haki `#958A54`.

| Rol | Değer | Kontrast |
|---|---|---|
| Düğme | mürekkep `#131A15`, krem yazı | 15.8:1 |
| Düğme (koyu bantta) | krem `#F4F3EC`, koyu yazı | ters çevrili |
| Vurgu — italik başlık, kart çizgisi, ok | yeşil `#2F6A2E` | 5.27:1 |
| Etiket / göz kırpma | haki `#6B6340` | 4.88:1 |
| Odak halkası | `#C6401A` | krem 4.09:1 · koyu 3.50:1 |
| Zemin | `#EBE7DB` · yüzey `#F4F1E7` | — |

**Neden turuncu düğme değil:** logo turuncuyu 40 piksellik bir çemberde
kullanıyor; 170×54'lük düz düğmeye yayılınca bağırıyor ve ucuz duruyor.
Renk yanlış değil, alan yanlıştı. Turuncu artık logoda ve odak halkasında.

**Turuncu asla metin rengi olamaz** — krem üzerinde 2.84:1, küçük metin
için 4.5, iri metin için 3.0 eşiğini de geçmiyor. Metin vurgusu `--vurgu`
(yeşil). Koyu bantta turuncu 5.11:1 ile serbest.

**Odak halkası ayrı bir token** (`--odak`): tek değerle hem krem hem koyu
zeminde 3:1 geçmesi gerekiyor, `#C6401A` bunu yapan tek ton.

**İçerik kuralının tam hâli:** sitedeki her cümle ya 4 Ağustos belgesinde ya da
canlı afloday.com dökümünde geçmeli. Rakam, rozet, referans, istatistik uydurma
yok. Kısaltma ve yeniden yazma da yok. Şu an **%95.7 kaynaklı** (kelime
bazında); kalanı etiket, sayaç, buton ve form metni.

**Push notu:** 5 Ağustos'ta kullanıcı açık onay verdi, site yayına alındı.
Bundan sonrası için yine sor — Ceylan hanım siteyi incelediği için her push
ona anında yansıyor.

**Belgede olmayan sayfa/bölüm üretme.** Belge 4 vitrin kartı diyor ama 2'sinin
metnini yazmış; site 2 kart gösteriyor, eksik ikisi Afloday'den istendi. Doğru
davranış bu.

---

## Kaynaklar — hepsi artık depoda

Orijinal `.docx` ve `.xlsx` geliştiricinin eski bilgisayarındaydı. Başka
makinede çalışılabilsin diye çıkarılmış hâlleri depoya alındı:

```
docs/kaynak/belge-tam.txt   4 Ağustos içerik belgesi, 551 satır, tablolar dahil
docs/kaynak/envanter.tsv    Excel site envanteri, 35 satır
_audit/orijinal/            canlı afloday.com'un 34 sayfalık metin dökümü
_audit/denetim/             13 denetim betiği + kullanım notu
```

`docs/kaynak/BENİOKU.md` bölüm haritasını ve tuzakları anlatıyor. **Oku.**

---

## Mimari

```
Next.js 15 · React 19 · TypeScript 5 · output: 'export'
Tailwind YOK · site/assets/css/afloday.css tasarımın kendisi
Bağımlılık: next, react, react-dom (üçü, o kadar)
```

**İçeriğin tek kaynağı `_build/build.mjs`.** Hem statik üreteç hem Next'in veri
kaynağı. Sayfaları bir diziye toplayıp `sayfalar` olarak dışa açıyor. Doğrudan
çalıştırılırsa `site/` altına yazıyor.

```
app/layout.tsx           belge iskeleti, fontlar, CSS ve JS bağlantısı
app/[[...slug]]/page.tsx tüm sayfalar tek yakalayıcı rotadan
_build/build.mjs         sayfa gövdeleri · sayfalar dizisi
_build/data.mjs          site bilgisi, menü, canliAdres tablosu, anasayfa verisi
_build/templates.mjs     kabuk, başlık, alt bilgi, ortak bileşenler
_build/etkinlikler.mjs   7 akordeon · 53 atölye · atolyeSayisi (tek doğru sayaç)
_build/gelecegi-tasarla.mjs · sosyal-sorumluluk.mjs · hakkimizda-rev2.mjs
_build/ceylan-rev2.mjs · egitimler.mjs · galeri-rev2.mjs
_build/kvkk.mjs          hazir:false olduğu sürece sayfa üretilmiyor
_build/varliklar.mjs     site/assets → public/assets + favicon.ico kökü
_build/gorsel-hazirla.mjs · og-gorsel.mjs · favicon.mjs
_build/onizle.mjs        yerel önizleme sunucusu
_build/verify.mjs        sayfa/görsel/bağlantı denetimi
```

**Adres eşleme:** `data.mjs` içindeki `canliAdres` tablosu. Sayfalar iç dosya
adlarıyla üretilip yazılmadan önce canlı adrese çevriliyor.

---

## Komutlar

```bash
npm run build                 # varlıkları kopyala + next build → out/
npm run dev                   # geliştirme sunucusu
node _build/build.mjs         # statik üreteç → site/
node _build/onizle.mjs 8899   # site/ için önizleme sunucusu
node _build/verify.mjs        # 20 sayfa · görsel · bağlantı denetimi
```

**Her yapısal değişiklikten sonra `verify` çalıştır.** Sıfır sorun vermeli.

---

## Yapıldı

- 4 Ağustos belgesinin 8 bölümü satır satır doğrulandı, 380 içerik satırı tam
- Belgenin 9 yerleşim yönergesi kod üzerinden sınandı, dokuzu da uygulandı
- Excel envanterinin 35 satırı doğrulandı, 34/34 canlı adres korunuyor
- Menü belgedeki düz sekiz maddeye indi
- Erişilebilirlik: 1020 kontrast ihlali giderildi, 24×24 altı dokunma hedefi yok
- Responsive: 390 / 768 / 1366 / 1920 / 2560 / 3840 — yatay taşma yok
- SEO: OG kapakları, 20/20 sayfada JSON-LD, açıklamalar 160 karakter altında
- Galeri sonsuz kayan şeride geçti (kullanıcının tasarımı, beş kusuru giderildi)
- Yayında: afloday.vercel.app · Vercel statik site olarak yayınlıyor

---

## Tuzaklar — hepsi bizzat yaşandı

**Betiği iki kez çalıştırma tuzağı.** `build.mjs` gövdeyi Next'e verirken betik
etiketini siliyor; deseni sorgu dizesini de kapsamalı (`afloday\.js[^"]*`).
Kapsamazsa etiket gövdede kalır, Next kabuğu bir kez daha ekler, betik iki kez
çalışır: dinleyiciler aç-kapa yapar (menü ve akordeon ölü görünür), WebGL ikinci
program kurup konsolu hata yağmuruna tutar, marquee iki kez katlanır.

**Önbellek damgası.** CSS ve JS adreslerine içerik özeti ekleniyor
(`afloday.css?v=<md5>`), hem `templates.mjs` hem `app/layout.tsx` içinde —
**ikisi ayrı çıktı, ikisinde de gerekli.** `vercel.json` `/assets/css/*` ve
`/assets/js/*` için `immutable` veriyor; damga olmadan dönen ziyaretçi eski
CSS'le bozuk sayfa görür.

**IntersectionObserver eşiği.** Yüzde eşiği (`threshold: 0.12`) ekrandan uzun
bölümlerde **hiç tetiklenmez**: 7935 piksellik akordeon 844 piksellik ekranda en
fazla %10 görünebiliyor. `threshold: 0` + `rootMargin` kullan.

**Denetim betikleri `data-reveal` opaklığını 1'e zorluyor** — bu, görünürlük
hatalarını gizler. Görünürlük ararken `_audit/denetim/gorunmez.mjs` kullan.

**Şablon dizesi içindeki yorumda ters tırnak kullanma**, diziyi kapatıp
derlemeyi kırar. Ve `node _build/build.mjs` çıktısını `/dev/null`'a yönlendirme,
hatayı gizler.

**CSS özgüllüğü.** `.serit:hover .serit-panel` (0,3,0) düz `.serit-panel:hover`
(0,2,0) kuralını ezer. Ayrıca bileşen tanımları CSS'te sonra geldiği için ortada
duran medya sorgusu bloğu eziliyor — telefon etiket puntoları bu yüzden dosya
sonunda.

**`<picture>` satır içi ve yüksekliksiz.** İçindeki `img`'ye `height:100%`
vermek yetmez, `picture`'a da vermek gerekir.

**Python'un varsayılan kodlaması cp1254.** Türkçe yazarken
`io.open(..., encoding='utf-8')` kullan, uzun çıktıyı konsola değil dosyaya yaz.

**JS'in `/i` bayrağı Türkçe İ ile çalışmıyor.** `/ikincil/i` "İkincil" ile
eşleşmez.

**`_audit/orijinal/` küçük harfe çevrilmiş ve birleştirilmiş aksan taşıyor.**
Karşılaştırırken iki tarafı da küçült ve NFC uygula.

**Python http.server `out/` klasörünü kilitler**, `next build` EBUSY verir.
`_build/onizle.mjs` kullan. Windows'ta süreç öldürmek için
`Get-CimInstance Win32_Process` + `Stop-Process`.

---

## Yayın ve DNS

**Kritik:** MX kaydı `afloday.com`'un kendisini gösteriyor. A kaydı değişirse
e-posta kesilir.

```
1. gün   MX → mail.afloday.com   (ikisi de aynı sunucu, değişen bir şey yok)
2-3. gün 48 saat bekle + e-posta testi
4. gün   A kaydı → Vercel        site yayında
```

Dokunulmayacak: `mail` `webmail` `ftp` `cpanel` `autodiscover` `autoconfig`
`nameserver` `SPF`. SPF kaydı var ve düzgün (`-all` ile bitiyor).

**Altyapı yerine geçilen ajansın kontrolünde:** ByFlash Agency = ByServer, site
+ e-posta + iki nameserver tek makinede (`5.253.141.186`). Erişim talebi oradan
geçecekse süre geliştiricinin kontrolünde değil.

**Vercel yapılandırması** (`vercel.json`): `framework: null`,
`outputDirectory: "out"`, `cleanUrls: true`, 18 adet 301. Faz 2'de sunucu tarafı
gerekince `output: 'export'` kalkacak, `framework` tekrar `"nextjs"` olacak,
`outputDirectory` silinecek. **İkisini aynı anda tanımlama** — dağıtım
`routes-manifest.json` bulunamadı diye patlar.

---

## Kullanıcı hakkında

İsmail Mert Bal · serbest geliştirici · Next.js/React akıcı. Nakit sıkışık, bu
iş ilk kurumsal referansı.

**Editoryal tercihleri:** kısa ve düz metin, satış dili yok, em dash yok,
çocuksu ton yok, savunmacı cümle yok. Uzun açıklama yerine tek net cümle.
Teknik jargonu müşteriye anlatırken sadeleştir ama içini boşaltma.

**Çalışma tarzı:** ölçüm ister, tahmin istemez. "Düzelttim" demeden önce ölç ve
kanıtı göster. Yanlış ölçüm yaptıysan söyle ve düzelt.

Fatura kendi şirketi olmadığı için bir yakınının ortağının şahıs şirketinden
kesilecek; ödeme faturayı kesen hesaba gitmeli.

**Corentia (corentia.com.tr) kullanıcının ayrı girişimi** — footer imzası için
kullanılmayacak; karar verilirse kişisel isim kullanılacak.

---

## Karar günlüğü

`docs/afloday-sorular-2026-08-04.md` — 31 madde, her kararın gerekçesi. Yeni bir
karar verdiğinde oraya madde ekle ve `docs/devam-plani.md`'yi güncelle.

---

## Denetim betikleri — iddia etmeden önce ölç

Bunlar 6 Ağustos turunda yazıldı ve gerçek hatalar buldu. Yapısal bir
değişiklikten sonra en az ilk üçünü çalıştır.

```bash
node _build/verify.mjs                # sayfa · görsel · bağlantı, 0 sorun vermeli
node _audit/denetim/a11y.mjs          # statik erişilebilirlik
node _audit/denetim/erisim.mjs        # erişilemeyen sayfa var mı
```

Scratchpad'deki tarayıcı denetimleri (kalıcı istenirse `_audit/denetim/`
altına taşınmalı):

| Betik | Ne ölçüyor | Bulduğu gerçek hata |
|---|---|---|
| `tamtest.mjs` | 31 sayfa × 6 ekran, 14 kusur türü | 186 kombinasyon tek koşumda |
| `kirpma.mjs` | Görsel doğal oranı ile çerçeve oranı | Kapak %89 kırpılıyordu |
| `kontrast.mjs` | Hesaplanmış renklerle WCAG kontrastı | Turuncu metin 2.84:1 |
| `tarayici.mjs` | Betik tekliği, skip link, 320px reflow, JS kapalı | Odak halkası 1.4.11'den kalıyordu |
| `bloklayici.mjs` | noindex, damga, ağırlık, yol adı harf duyarlılığı | — |

**Yanlış pozitif tuzakları — bunlara harcanan zamanı geri kazan:**

- `<a[^>]*>` regex'i `<article>` ve `<address>` etiketlerini de yakalar.
  `<as` ya da `<a>` kullan.
- "me**todo**loji" kelimesi `TODO` aramasıyla eşleşir.
- Next `afloday.js`'i `next/script` ile çalışma anında ekliyor; HTML'de
  `<script src>` yok. Betik sayısını **tarayıcıda** say.
- Anasayfada menü koyu videonun üzerinde; saydam başlığın arkasındaki
  gövde rengini okuyan kontrast betiği 9 yanlış pozitif üretir.
- Tembel görseller ölçüm anında henüz yüklenmemiş olabilir.
  `networkidle` + `img.complete` beklemeden "yüklenmeyen görsel" sayma.
- Cümle içi bağlantılar WCAG 2.5.8'in dokunma hedefi kuralından muaf.

**CSS `url()` göreli yolu stil dosyasına göre çözülür, sayfaya göre değil.**
`style="--kare:url('assets/...')"` yazınca tarayıcı `/assets/css/assets/...`
arar ve 404 alır. CSS'ten okunan yollar kök-göreli olmalı (`/assets/...`).

**`<button>` öğesinde `align-self` blok eksende çalışmıyor.** Izgara hücresi
olan bir düğme satır yüksekliğini alır. Oranı düğmenin kendisine ver.

**`aspect-ratio` + `min-height` genişliği yükseklikten türetebilir.**
`min-height: 280px` ve `aspect-ratio: 4/3` birlikte 373px genişlik üretti,
360 piksellik ekranda taşırdı. Genişliği açıkça yaz.
