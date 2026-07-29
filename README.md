# Afloday — site revizyon prototipi

afloday.com'un içerik ve tasarım revizyonu. Statik site, bağımlılık yok.

## Çalıştırma

```bash
node _build/build.mjs      # 36 HTML sayfa + sitemap + robots üretir
node _build/verify.mjs     # yapısal denetim (h1, meta, alt, kırık bağlantı…)
node _audit/kapsam.mjs     # içerik kapsamı: orijinal cümleler bizde var mı?
node _audit/serve.mjs      # http://localhost:4321
```

## ⚠️ Önce bunu okuyun — hero videosu Afloday'e ait DEĞİL

`site/assets/video/hero.mp4` **yapay zekâ ile üretilmiş geçici bir açılış videosudur.**
Afloday'in çekimi değildir, hiçbir Afloday atölyesini göstermez. Yalnızca tasarımın
tam ekran video ile nasıl göründüğünü göstermek için konmuştur.

Yayına almadan önce şu üç seçenekten biri uygulanmalı:
1. Afloday'in kendi tanıtım filminin master dosyası ile değiştirin (tercih edilen), veya
2. Videoyu tamamen kaldırıp `site/assets/img/hero/` altındaki gerçek fotoğraflardan
   biriyle sabit bir hero kurun, veya
3. Bu haliyle bırakacaksanız videonun stok/AI kaynaklı olduğunu Afloday'e yazılı bildirin.

Anasayfadaki YouTube filmi (`asJG04Q9QUI`) ise **gerçektir** — Afloday'in kendi
kanalındaki "Afloday_Geleceği Doğadan Tasarla_Doğa Temelli Eğitimler" videosudur.

Sitedeki diğer tüm fotoğraflar (546 görsel) afloday.com'dan birebir indirilmiştir.

---

## İçerik ilkesi

**Sitedeki her cümle afloday.com'dan gelir.** Uydurulmuş kod, rozet, rakam
ya da taahhüt yoktur. Yapılan tek müdahale, kaynakta bulunan bariz imla ve
noktalama hataları için ve her biri `_audit/ekip-duzelt.mjs` içinde yorumla
işaretli:

| Orijinal | Bizde | Neden |
|---|---|---|
| `Kariyer yolculuğu ;` | `Kariyer yolculuğu;` | noktalama |
| `Nestle Türkiye, ve` | `Nestle Türkiye ve` | fazla virgül |
| `Müdürü Olarak,` | `Müdürü olarak` | büyük harf |
| `Ingiliz Dili` | `İngiliz Dili` | imla |
| `Uluslararası ilişkiler` | `Uluslararası İlişkiler` | imla |
| `kültür -değişim` | `kültür-değişim` | tire |
| `tasarlnıyor` | `tasarlanıyor` | yazım |

`node _audit/kapsam.mjs` bu farkları tek tek listeler.

Fiyat, süre, kontenjan, "malzeme dahil" gibi afloday.com'da yazmayan hiçbir bilgi
siteye konmamıştır — uydurmak yerine boş bırakılmıştır.

## Kaynak dosyalar

- `_build/data.mjs` — tüm içerik (16 atölye, 3 kurumsal hat, 7 kişi, 2 proje,
  9 dönemsel konsept vakası, menü ağacı, form alanları)
- `_build/gorseller.mjs` — afloday.com'un her sayfasında kullandığı görsellerin
  birebir listesi (`_audit/gorsel-map-uret.mjs` üretir)
- `_build/templates.mjs` — kabuk: mega menü, footer, hero, defter, galeri, ışık kutusu
- `_build/build.mjs` — sayfa üretimi
- `site/` — yayına hazır çıktı (bu klasörü olduğu gibi sunucuya at)

## Denetim

- `_audit/orijinal-dump.mjs` → `_audit/orijinal/` — afloday.com'un 34 sayfasının tam metni
- `_audit/govde/` — menü/footer kabuğu ayıklanmış saf gövde metni
- `_audit/gorsel-indir.mjs` — 274 orijinal görseli indirir
- `_audit/layout-audit.js` — tarayıcıda düzen denetimi (taşma, kırık görsel,
  kesilen metin, çökmüş kap, dokunma hedefi)

Son durum: **36 sayfa · 546 görsel · 3395 bağlantı · 0 yapısal sorun**,
34 sayfa × 7 genişlik (360→1920) = **238 kombinasyon, 0 düzen hatası**.

## Teslimden önce

1. **Hero videosunu değiştirin** — en üstteki uyarıya bakın.
2. `site/` klasörünü yayınlayın (Netlify/Vercel sürükle-bırak yeterli).
3. Formlar demo çalışıyor; gerçek gönderim için bir uç nokta bağlanmalı.
4. Fiyat, süre ve kontenjan bilgisi sitede hiç yok — çünkü afloday.com'da da yok.
   Afloday bu bilgileri verirse eklenir.
