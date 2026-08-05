# Afloday — afloday.com

Afloday'in kurumsal sitesi. Next.js ile statik olarak dışa aktarılıyor,
Vercel'de yayınlanıyor.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ klasörüne statik dışa aktarım
npm run dogrula    # yapısal denetim: h1, meta, alt metin, kırık bağlantı, çapa
```

## Mimari — kodu değiştirmeden önce okuyun

Bu depo alışılmış bir Next.js projesi gibi görünmez ve bu bilinçli bir
tercihtir. `app/` klasöründe yalnızca dört dosya var; sayfa gövdeleri React
bileşeni değil, `_build/` altında üretilen HTML dizgeleri.

Gerekçesi, sınırları ve ne zaman değiştirilmesi gerektiği:
[`docs/mimari.md`](docs/mimari.md).

```
_build/            içerik ve şablonlar — tek doğruluk kaynağı
  data.mjs         site bilgisi, menü, canlı adres tablosu
  build.mjs        sayfaları üretir; hem statik üreteç hem Next.js'in kaynağı
  templates.mjs    paylaşılan bileşenler (folio, akordeon, slayt, galeri…)
  icerik.d.ts      içerik veri dosyalarının tip tanımları
  kurumsal-rev2.mjs · sosyal-sorumluluk.mjs · hakkimizda-rev2.mjs
  gelecegi-tasarla.mjs · egitimler.mjs · etkinlikler.mjs · ceylan-rev2.mjs
                   4 Ağustos 2026 içerik belgesinden gelen sayfa verileri
  kvkk.mjs         KVKK/çerez — metin bekleniyor, sayfa üretilmiyor
  verify.mjs       yapısal denetim
  gorsel-hazirla.mjs  kaynak fotoğrafları web'e hazırlar
app/               Next.js kabuğu: layout, yakalayıcı rota, sitemap, robots
site/assets/       CSS, JS, görseller (kaynak) — derleme öncesi public/'e kopyalanır
site/*.html        statik üretecin çıktısı (yedek yol, önizleme için)
docs/              plan, karar günlüğü, mimari notu
```

## İçerik nasıl değiştirilir

Metinler `_build/` altındaki veri dosyalarında. Sayfa yapısını değiştirmeden
metin güncellemek için ilgili `.mjs` dosyasını düzenleyip `npm run build`
çalıştırmak yeterli.

**Kural: sitedeki her cümle ya afloday.com'da ya da 4 Ağustos 2026 tarihli
içerik belgesinde geçmelidir.** Rakam, rozet, referans ve istatistik
uydurulmaz. Belgedeki dizgi hataları için yapılan düzeltmeler her veri
dosyasının başında tek tek listeli.

## Adres eşleşmesi

Canlı sitedeki adresler birebir korunuyor. `data.mjs` içindeki `canliAdres`
tablosu iç dosya adlarını canlı adreslere çeviriyor; sayfa yazılmadan önce
dosya adı, iç bağlantılar, canonical ve sitemap bu tablodan geçiyor.

Müşteri envanterindeki 34 adresin 19'u iptal edildi, hiçbiri kaybolmadı:

```
16 atölye sayfası            →  /dogadan-hobi-atolyeleri     301
/katilim                     →  /iletisim                    301
/dogadan-gelisim-atolyeleri  →  /doga-temelli-egitimlerimiz  301
/dogadan-hobi-atolyeleri     →  yeni Etkinlik sayfası devraldı
```

Yönlendirmeler `vercel.json` içinde. Yapısal bir değişiklikten sonra
`npm run dogrula` çalıştırın.

## Bekleyen işler

| İş | Durum | Kimde |
|---|---|---|
| KVKK aydınlatma metni, çerez politikası | metin yok | Afloday hukukçuları |
| Formların gerçek gönderime bağlanması | gösteri modunda | KVKK metnine bağlı |
| Hero videosunun değiştirilmesi | geçici AI videosu | Afloday |
| Blog ve yönetici paneli | başlamadı | 2. aşama, Supabase |
| DNS geçişi | cPanel erişimi bekleniyor | Afloday |

**KVKK:** `_build/kvkk.mjs` içindeki `hazir` alanı `false` olduğu sürece
sayfalar üretilmiyor ve her derlemede uyarı basılıyor. Boş bir hukuki sayfa,
ziyaretçiye taahhüt veriyormuş gibi görünüp hiçbir şey söylemediği için
sayfanın hiç olmamasından kötüdür. **Metin gelmeden formlar gerçek gönderime
bağlanmamalı** — aydınlatma metni olmadan veri toplamak KVKK ihlalidir.

## ⚠️ Hero videosu Afloday'e ait DEĞİL

`site/assets/video/hero.mp4` **yapay zekâ ile üretilmiş geçici bir açılış
videosudur.** Afloday'in çekimi değildir, hiçbir Afloday atölyesini göstermez.
Yalnızca tasarımın tam ekran video ile nasıl göründüğünü göstermek için
konmuştur.

Yayına almadan önce şu üç seçenekten biri uygulanmalı:

1. Afloday'in kendi tanıtım filminin master dosyası ile değiştirin (tercih
   edilen), veya
2. Videoyu tamamen kaldırıp `site/assets/img/hero/` altındaki gerçek
   fotoğraflardan biriyle sabit bir hero kurun, veya
3. Bu haliyle bırakacaksanız videonun stok/AI kaynaklı olduğunu Afloday'e
   yazılı bildirin.

Anasayfadaki YouTube filmi (`asJG04Q9QUI`) **gerçektir** — Afloday'in kendi
kanalındaki "Afloday_Geleceği Doğadan Tasarla_Doğa Temelli Eğitimler"
videosudur.

## Görseller

4 Ağustos belgesiyle gelen fotoğraflar `_build/gorsel-hazirla.mjs` ile
hazırlanıyor: en uzun kenar 1600, WebP + 800px varyant + JPG yedeği, dosya
başına 300 KB üst sınır. Çıktı `site/assets/img/rev2/<klasor>/` altında.

Klasör ayrımı şart: *Seçilmiş Olanlar* ve *Galeri* içinde ayrı ayrı
`Resim1.jpg` var. Betik aynı klasörde slug çakışması bulursa derlemeyi
durduruyor.

Hazırlanmış görseller depoda; kaynak klasör elde yoksa betiği çalıştırmaya
gerek yok.

## Denetim

`npm run dogrula` yapısal denetimi çalıştırır: eksik h1, çift h1, boş alt
metin, kırık bağlantı, olmayan çapa, yer tutucu metin.

İçerik denetimi ayrıdır: 4 Ağustos belgesinin her satırının sitede birebir
geçtiği doğrulanmıştır. Belge 540 satır; içerik taşıyan 357 satırın tamamı
karşılanıyor.
