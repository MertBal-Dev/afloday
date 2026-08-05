# Afloday — proje hafızası

> Yeni oturumda önce bu dosyayı oku, sonra
> `docs/superpowers/plans/2026-08-02-afloday-rev2-mimari-ve-devir.md` planını aç.
> **En son iş:** `docs/gece-denetimi-2026-08-05.md` — belge sayfa sayfa
> doğrulandı, galeri ve erişilebilirlik düzeltildi.
> Son güncelleme: 5 Ağustos 2026 sabaha karşı.

---

## Durum tek bakışta

**İş bağlandı ve kapsam belgesi geldi.** Next.js taşıması bitti, doğrulandı.
Şu an içerik döküm aşamasındayız.

```
Müşteri      Afloday · Ceylan Kalyon Özdemir (kurumsal iletişim)
Teknik kişi  Hasan Basri Ünlü (Afloday tarafı)
Bedel        20.000 TL KDV dahil · site + blog + panel, tek paket
Fatura       tek fatura, site yayına alındığında
Bakım        ilk 3 ay dahil · 3. ay sonunda yıllık bedel birlikte belirlenecek
Teslim       site: erişimden 3-4 iş günü · blog+panel: en geç 3 hafta
Bekleyen     cPanel erişimi — sayaç o gün başlıyor
```

**Fiyat pazarlığı kapandı, bir daha açma.** Kullanıcı net söyledi: kapsam belgede
ne yazıyorsa o.

---

## Değişmez kurallar

**1 · İçerik uydurma.** Sitedeki her cümle ya afloday.com'da ya da 4 Ağustos
tarihli içerik belgesinde geçmeli. Rakam, rozet, referans, istatistik uydurma yok.
Kısaltma ve yeniden yazma da yok — belgede nasıl yazıyorsa öyle.

**2 · Commit ve push yok.** Kullanıcı açıkça istedi. Vercel önizlemesi Afloday'de
var, push edilirse görürler. Yerel commit teknik olarak güvenli (deploy etmez) ama
kullanıcı istemedi — sormadan yapma.

**3 · Adres eşleşmesi kutsal.** Canlı afloday.com'daki 34 adres birebir korunuyor.
Herhangi bir değişiklikten sonra doğrula, bu iş zor kazanıldı.

**4 · Tasarım dili — çoğu KAYNAKLI DEĞİL, geliştiricinin tercihi.**
Belgede köşe, font, renk paleti, tipografi hakkında **tek kelime yok**; sadece
9 yerleşim yönergesi var (satır 14, 15, 23, 32, 49, 54, 302, 304, 389) ve
hepsi uygulandı. Canlı afloday.com ise `border-radius: 10px` kullanıyor.

Yani saç teli çizgi, serif başlık, bronz etiket, karmen vurgu ve bir dönem
uygulanan "köşe yuvarlaması yok" kararı **bağlayıcı kural değil, tasarım
tercihi**. Değiştirilebilir; müşteri onayı yeter, belgeye danışmak gerekmez.

**Bağlayıcı olan tek şey:** Tailwind kurulmadı, `afloday.css` tasarımın kendisi
(mimari karar, madde 4'te değil `docs/mimari.md`'de gerekçesi var).

---

## Kapsam kaynağı — buradan okunur

```
C:\Users\Gaming\Downloads\wetransfer_afloday-web-metin-ve-gorseller_2026-08-04_1711\Afloday Web Metin ve Görseller\
  ├─ Afloday_WEB Sayfası Metinler_04082026.docx     ← ASIL KAYNAK · 65.000 karakter
  ├─ Afloday_Mevcut_Site_Envanteri_Dolu.xlsx        ← güncel site haritası
  ├─ Seçilmiş Olanlar/        24 dosya · 194 MB · belgede adı geçenler
  ├─ Doğadan Etkinlik.../     71 dosya · 184 MB
  ├─ Galeri/                  21 dosya ·  11 MB
  └─ Diğer Görseller/        136 dosya · 1.3 GB · kütüphane, seçmeli kullan
```

**Uyarı:** `Downloads\01_Mevcut_Site_Envanteri_Dolu.xlsx` **eski sürüm** (2 Ağustos),
kullanma. `site/assets/img` altındaki eski çiçek/atölye fotoğrafları da artık
kullanılmıyor.

Belge metni çıkarılmış hâlde:
`scratchpad/afloday-metinler.txt` (540 satır) — yoksa `.docx`'ten yeniden çıkar
(zipfile + `word/document.xml`, `<w:t>` etiketlerini topla).

---

## Konumlandırma değişti

```
ESKİ   Çiçek ve bitki hobi atölyeleri · bireysel müşteri
YENİ   Kurumsal eğitim ve gelişim · B2B · doğa temelli metodoloji
```

Site **34 → 16 sayfaya** iniyor. 16 atölye sayfası + `/katilim` +
`/dogadan-gelisim-atolyeleri` + `/dogadan-hobi-atolyeleri` iptal (19 adres).
Yerine **tek yeni sayfa**: *Doğadan Etkinlik Atölye Deneyimleri* — atölyeler orada
7 akordeon kategorisi altında toplanıyor.

Sayfa sayısı azalıyor ama **iş artıyor**: içerik çok daha yoğun, bölümler yeni.

---

## Mimari

```
Next.js 15 · React 19 · TypeScript 5 · output: 'export'
Tailwind YOK · afloday.css olduğu gibi kullanılıyor
three@0.185 kurulu (hero slaydı için)
```

**İçeriğin tek kaynağı `_build/build.mjs`.** Hem statik üreteç hem Next.js'in veri
kaynağı. Sayfaları bir diziye topluyor, `sayfalar` olarak dışa açıyor
(gövde + meta ayrıştırılmış). Doğrudan çalıştırılırsa `site/` altına yazıyor.

```
app/layout.tsx           belge iskeleti, fontlar, afloday.js betiği
app/[[...slug]]/page.tsx tüm sayfalar tek yakalayıcı rotadan
app/sitemap.ts           adresler build.mjs'ten
app/robots.ts            PREVIEW=1 iken Disallow
_build/data.mjs          içerik + canliAdres tablosu
_build/egitimler.mjs     5 eğitim programı (data.mjs re-export ediyor)
_build/etkinlikler.mjs   7 akordeon · 50 etkinlik atölyesi
_build/galeri-rev2.mjs   21 galeri fotoğrafı (otomatik üretilir)
_build/gorsel-hazirla.mjs  belge görsellerini web'e hazırlar
_build/varliklar.mjs     site/assets → public/assets kopyalama
_build/verify.mjs        38 sayfa denetimi, cleanUrls farkında
```

**Görsel boru hattı:** `node _build/gorsel-hazirla.mjs` kaynak klasörden okur,
`site/assets/img/rev2/<klasor>/` altına yazar — en uzun kenar 1600, WebP + 800px
varyant + JPG yedeği, dosya başına 300 KB üst sınır (aşarsa önce kalite, sonra
ölçü düşer). Klasör ayrımı şart: *Seçilmiş Olanlar* ve *Galeri* içinde ayrı
ayrı `Resim1.jpg` var, tek klasöre yazılınca biri diğerini eziyordu. Betik
aynı klasörde slug çakışması bulursa derlemeyi durduruyor.

**Varlıklar:** kaynak `site/assets`, derleme öncesi `public/assets`'e kopyalanıyor,
`public/` gitignore'da. İki kopya git'e girmiyor.

**Adres eşleme:** `data.mjs` içindeki `canliAdres` tablosu. Sayfalar eski
dosya adlarıyla üretiliyor, yazılmadan önce dosya adı + iç bağlantılar + canonical
+ sitemap canlı adrese çevriliyor. Next.js'te klasör adı = adres olacağı için bu
katman ileride sadeleşebilir.

---

## Komutlar

```bash
npm run build        # varlıkları kopyala + next build → out/
npm run dev          # varlıkları kopyala + next dev
npm run dogrula      # node _build/verify.mjs
node _build/build.mjs # eski statik üreteç → site/ (yedek olarak duruyor)
```

**Adres doğrulaması** (her yapısal değişiklikten sonra çalıştır): `out/` içindeki
`.html` dosyalarını canlı 34 adresle karşılaştır. Liste planın *Adres haritası*
bölümünde.

---

## Tuzaklar — hepsi bizzat yaşandı

**Python http.server `out/` klasörünü kilitliyor.** `next build` `EBUSY` verir.
Test sunucusunu kapatmadan derleme yapma. `pkill -f` Windows'ta çalışmıyor;
`Get-CimInstance Win32_Process` ile bul, PID ile `Stop-Process`. **IDE'nin
jedi-language-server python sürecini öldürme.**

**Bash heredoc, Türkçe içerikli uzun JS bloklarında bozuluyor.** Büyük veri
dosyalarını Write aracıyla yaz, `cat <<'JS'` ile değil.

**Python'un varsayılan kodlaması cp1254.** Türkçe/unicode yazarken
`io.open(..., encoding='utf-8')` kullan, `print` ile em dash basma.

**Playwright başsız tarayıcıda CSS animasyonu geç başlıyor.** `currentTime`
ilerliyorsa animasyon çalışıyordur; ekran görüntüsü zaman aşımına uğruyorsa bu
aslında animasyonun sürdüğünün kanıtı.

---

## Yapıldı

- Canlı siteden 34 adres çıkarıldı, HTTP durumlarıyla doğrulandı
- `canliAdres` tablosu · `cleanUrls` · **34/34 adres korunuyor**
- `kurumsal` ikiye ayrıldı (`/dogadan-gelisim-atolyeleri` sonradan iptal oldu)
- Anasayfa slaydı — CSS daire açılımı *(WebGL sürümüyle değişecek)*
- **Next.js taşıması** — 37/37 sayfa gövdesi statikle birebir aynı
- sitemap + robots Next tarafında, `vercel.json` `out/`'a göre
- Kapsam belgesi çözüldü, plan baştan yazıldı
- Karar günlüğü: `docs/afloday-sorular-2026-08-04.md` — 11 karar, 2 soru
- **Veri:** `heroSlaytlari` (3) · `degerOnerisi` (3) · `istatistikler` (4) ·
  `metodoloji` (3) · `egitimler` (5, tam) · `deneyimVitrini` (2) ·
  `etkinlikKategorileri` (7 akordeon, 50 atölye)
- Belgede adı geçen 29 görselin 29'u klasörde doğrulandı
- **52 görsel işlendi** — 3 varyant, dosya başına ≤300 KB (3 istisna, yoğun doku)
- **Etkinlik sayfası** — `/dogadan-hobi-atolyeleri` adresini devraldı
- **Anasayfa yeniden yazıldı** — cam geçişli slayt dahil 8 bölüm
- Metin denetimi: 129 metnin 129'u belgede birebir geçiyor, ters yönde de
  belgenin 126 satırının tamamı veride karşılanıyor

---

## Sıradaki iş — buradan devam et

```
1-7  İçerik, 8 sayfa, görseller, sayfa haritası, menü   ✅ BİTTİ
8    Formlar · KVKK · yayın hazırlığı                   ← BURADASIN
9    Blog + /admin paneli (Supabase, 2. aşama)
```

**Site içerik olarak bitti.** 4 Ağustos belgesinin içerik taşıyan 357
satırının tamamı sitede birebir karşılanıyor (doğrulandı, ölçüldü).

**8. adımda kalan:**
- Formlar gösteri modunda (`data-demo="form-ok"`), gerçek gönderime bağlı değil
- **KVKK metni Afloday'den bekleniyor.** `_build/kvkk.mjs` içindeki `hazir`
  false olduğu sürece sayfa üretilmiyor ve her derlemede uyarı basılıyor.
  Metin gelmeden form gerçek gönderime bağlanmamalı — aydınlatma metni
  olmadan veri toplamak KVKK ihlali.
- Hero videosu hâlâ geçici AI videosu (README'nin başında uyarı var)
- DNS geçişi cPanel erişimi bekliyor

## 5 Ağustos gecesi yapılanlar

- **Belge sayfa sayfa doğrulandı** — 7 bölüm, satır satır. Karşılıksız içerik
  satırı yok. Belgenin 3 tasarım yönergesi de kod üzerinden sınandı.
- **Atölye sayısı düzeltildi: 50 → 53.** Kurumsal Gönüllülük'ün 3 atölyesi
  `uygulanabilir` alanında; akordeon başlığı sayıyordu, künye saymıyordu.
  `etkinlikler.mjs` içinde `atolyeSayisi`/`toplamAtolye` tek doğru kaynak.
- **Menü düz sekiz maddeye indi** (belge satır 381-388). Mega panel kalktı;
  erişilemeyen sayfa yok, 34/34 adres duruyor.
- **Galeri sonsuz kayan şeride geçti** (kullanıcının tasarımı). Beş kusur
  giderildi: uydurma kategori etiketleri, ışık kutusunun kopyaları sayması,
  duraklat düğmesinin olmaması, silinmiş odak halkası, uydurma bar metinleri.
- **Erişilebilirlik:** 1020 kontrast ihlali giderildi (bronz `#8A6A38`→`#7D5F31`,
  alt bilgi buton özgüllüğü, koyu bölüm için `--element-lift`). Dokunma
  hedeflerinde slayt gezinme düğmesi 77×2 pikseldi. 24×24 altı kalmadı.
- **Metin kaynağı %95.7** (kelime bazında). Denetim betikleri scratchpad'de:
  `bolum.mjs`, `hucre-ac.mjs`, `a11y.mjs`, `canli.mjs`, `kesin.mjs`.

**Erişilebilirlik eşiği artık korunmalı:** yeni renk eklerken sayfa zemini
`#E9E9E0`, koyu bölüm `#131A15`. Yeni dokunma hedefi eklerken alt sınır 24×24,
tercihen 44×44.

---

**Anasayfa bölüm sırası:** video hero (olduğu gibi kaldı) → cam geçişli 3 slayt
→ değer önerisi şeridi → "Neden Doğa Temelli Gelişim?" 4 istatistik → Kök
Sal/Sorumluluk Al/Birlikte Yeşer → 5 eğitim vitrini → 2 deneyim vitrini →
galeri (21 kare) → referans logoları.

## Sayfa haritası — 19 dosya

```
Envanterin 16'sı   /  hakkimizda  ik  iletisim  gelecegi-tasarla
                   sosyal-sorumluluk-is-danismanligi  doga-temelli-egitimlerimiz
                   dogadan-hobi-atolyeleri  gulumseyen-yarinlar-projesi
                   + 7 ekip sayfası
Menü için eklenen  kurumsal  surdurulebilirlik
Standart           404
```

**19 iptal adres kaybolmadı:** 16 atölye → `/dogadan-hobi-atolyeleri`,
`/katilim` → `/iletisim`, `/dogadan-gelisim-atolyeleri` →
`/doga-temelli-egitimlerimiz` (hepsi `vercel.json`'da 301);
`/dogadan-hobi-atolyeleri` adresini yeni Etkinlik sayfası devraldı.

**Menü belgeden geliyor** (belge satır 372-379), sıra dahil birebir:
Anasayfa · Hakkımızda · Geleceği Doğadan Tasarla · Doğa Temelli Eğitimlerimiz ·
Kurumsal Hizmetler · Sürdürülebilirlik · Galeri · İletişim.

## Depo temizliği — yapıldı

Sayfa haritası 34'ten 19'a inince 494 görsel sahipsiz kaldı (silinen 16 atölye
sayfasının galerileri, eski anasayfa kategorileri, kullanılmayan varyantlar).
**494 dosya / 34.8 MB silindi**, 47 boş klasör kaldırıldı. `site/assets`
58 MB'tan 24 MB'a indi.

Tespit betiği scratchpad'de: HTML'deki her `assets/` yolunu, CSS `url()`
ve JS içindeki yolları toplayıp diskteki dosyalarla karşılaştırıyor.
Silmeden önce `/surdurulebilirlik` ve `/gulumseyen-yarinlar-projesi`
sayfalarının görselleri elle doğrulandı — ikisi de korunuyor.

`_audit/` (316 KB, 20 betik) duruyor: orijinal siteyle karşılaştırmanın
kaydı, silmek kazanç değil kayıp olurdu.

## Teslim belgeleri — yazıldı

- `README.md` — projeyi gerçekten anlatıyor (eskisi hâlâ "bağımlılık yok" diyordu)
- `docs/mimari.md` — Next.js'in neden render için kullanılmadığı, sınırın nerede
  olduğu, dönüşüm gerekirse nasıl yapılacağı
- `_build/icerik.d.ts` — içerik veri dosyalarının tip tanımları

---

## Anasayfa slaydı — cam geçişi ✅ YAPILDI

Kaynak: 21st.dev · `lumina-interactive-list` (`docs/referans/Not.md`,
shader `docs/referans/hero-slayt-cam-gecis.md`).

**Kullanıcı "birebir bu tasarım olacak" dedi.** Düzen ve sınıf adları kaynakla
aynı: `.slider-wrapper` · `.webgl-canvas` · `.slide-number` / `.slide-total` ·
`.slide-content` > `.slide-title` / `.slide-description` · `.slides-navigation`
> `.slide-nav-item` > `.slide-progress-line`.

Uygulama farkı — **Three.js ve GSAP kullanılmadı.** Efektin tamamı tek bir
fragment shader; shader kaynaktakiyle birebir, düz WebGL ile çiziliyor
(`afloday.js`). Görünen sonuç aynı, eklenen ağırlık sıfır, CDN bağımlılığı yok.
Harf harf açılım GSAP yerine CSS `--i` gecikmesiyle.

Diğer uyarlamalar: 6 demo görseli yerine belgedeki 3 slayt · Afloday paleti ve
Newsreader + Jost · duraklat düğmesi, ok tuşları, `prefers-reduced-motion` ·
görünmezken ve sekme arkadayken çizim duruyor · WebGL yoksa CSS daire açılımı
devralıyor.

**Video hero olduğu gibi duruyor**, slayt onun altında — kullanıcının açık isteği.
İkisi de `100dvh`: arka arkaya iki tam ekran, aralarında yükseklik farkı yok.

**Odak noktası (`odak`, data.mjs):** görsel tam ekranı kaplarken kırpılıyor;
merkez kırpma birinci slaytta kadının yüzünü kesiyordu. `odak` CSS
`object-position` gibi okunuyor (soldan ve ÜSTTEN yüzde) ve iki yere birden
gidiyor: CSS geri düşüşünde `object-position`, shader'da `uFocus1/uFocus2`.
Shader'da doku y ekseni ters (UNPACK_FLIP_Y) olduğu için y 1'den çıkarılıyor.
`getCoverUV` kaynakta sabit 0.5'ti; 0.5 verilirse davranış birebir aynı.

---

## Yayın — DNS

**Kritik:** MX kaydı `afloday.com`'un kendisini gösteriyor. Site A kaydı
değiştiği an e-posta kesilir.

```
1. gün   MX → mail.afloday.com   (ikisi de aynı sunucu, hiçbir şey değişmez)
2-3. gün 48 saat bekle + e-posta testi
4. gün   A kaydı → Vercel        site yayında
```

Dokunulmayacak: `mail` `webmail` `ftp` `cpanel` `autodiscover` `autoconfig`
`nameserver` `SPF`. SPF kaydı **var ve düzgün** (`-all` ile bitiyor).

**Altyapı, yerine geçilen ajansın kontrolünde:** ByFlash Agency = ByServer,
site + e-posta + iki nameserver hepsi tek makinede (`5.253.141.186`). Erişim
talebi oradan geçecekse süre geliştiricinin kontrolünde değil.

---

## Kullanıcı hakkında

İsmail Mert Bal · serbest çalışan geliştirici · Next.js/React akıcı.
Nakit sıkışık, bu iş ilk kurumsal referansı.

**Editoryal tercihleri:** kısa ve düz metin, satış dili yok, em dash yok,
çocuksu ton yok, savunmacı cümle yok. Uzun açıklama yerine tek net cümle.
Teknik jargonu müşteriye anlatırken sadeleştir ama içini boşaltma.

Fatura kendi şirketi olmadığı için bir yakınının ortağının şahıs şirketinden
kesilecek; ödeme faturayı kesen hesaba gitmeli.
