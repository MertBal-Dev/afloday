# Belge kapsam raporu

`Afloday_WEB Sayfası Metinler_04082026.docx` — 551 satır, tablolar dahil.
Bölüm bölüm, satır satır doğrulandı. İki bağımsız denetim yapıldı
(geliştirici + ayrı agent), sonuçlar örtüşüyor.

---

## Bölüm bölüm durum

| # | Bölüm | Belge satırı | İçerik satırı | Karşılıksız | Durum |
|---|---|---|---|---|---|
| 1 | Anasayfa | 1-117 | 52 | 2 | ✅ tam |
| 2 | Kurumsal Hizmetler | 118-122 | 23 | 0 | ✅ tam |
| 3 | Sosyal Sorumluluk & İş Danışmanlığı | 123-164 | 27 | 0 | ✅ tam |
| 4 | Hakkımızda | 165-183 | 9 | 0 | ✅ tam |
| 5 | Doğa Temelli Eğitimlerimiz | 184-295 | 81 | 1 | ✅ tam |
| 6 | Geleceği Doğadan Tasarla | 296-389 | 49 | 11 | ✅ tam |
| 7 | Ceylan Kalyon Özdemir özgeçmişi | 390-407 | 13 | 0 | ✅ tam |
| 8 | Etkinlik Atölyeleri (7 akordeon) | 408-551 | 126 | 1 | ✅ tam |

**Toplam 380 içerik satırı, karşılıksız 0.**

### "Karşılıksız" çıkan 15 satırın tamamı belgenin kendi yapısı

| Satır | Ne olduğu |
|---|---|
| 53 | `%58 …(Korn Ferry, 2021-2023)` — sayfada var, üç ayrı elemana bölünmüş (rakam / açıklama / kaynak) |
| 96 | `WhatsApp Image 2026-07-22…` — görsel dosya adı |
| 184, 296, 408 | Belgenin sayfa başlıkları (`"Doğa Temelli Eğitimlerimiz" Sayfası`) |
| 298, 300, 303, 305, 307 | Belgenin bölüm başlıkları (`① Hero — Senfoni Girişi` vb.) |
| 302, 304, 306 | Tasarım yönergeleri — üçü de uygulandı, ayrıca sınandı (aşağıda) |
| 348 | Belgenin bize yazdığı iç not — sayfada görünüyordu, **kaldırıldı** |
| 381 | Bileşik satır (eğitim adı + menü listesinin başı) |

---

## Belgenin 9 yerleşim yönergesi — hepsi uygulandı

Bunlar metin değil davranış; metin denetimine takılmazlar, kod ve
hesaplanmış stil üzerinden ayrıca doğrulandı.

| Satır | Yönerge | Kanıt |
|---|---|---|
| 14 | Slayt 1 görseli | belgenin 16. satırda verdiği dosya |
| 15 | "Metinler görsellerin üzerine yazılsın" | `.slide-content` `position:absolute` `z-index:3` + okunurluk perdesi |
| 23 | Slayt 2 görseli | `Resim1.jpg` |
| 32 | Slayt 3 görseli | belgenin 33. satırdaki dosyası |
| 49 | 4 istatistik kutusu | 4 kutu |
| 54 | "Büyük punto + düşük foto yoğunluğu" | rakam 71.7px · doku %14 opaklık (sonradan %26) |
| 302 | 4 küçük ikon, pencerelere harita | 4 SVG ikon, 4 çapa bağlantısı |
| 304 | 4 anchor kart, kendi rengi, element rozeti | 4 bölüm / 4 renk / 4 rozet / 4 çapa hedefi |
| 389 | "Referans logoları kalsın" | 30 logo |

**Not (satır 54):** belge "yaprak/toprak deseni" diyor ama 55. satırda kendi
görselini veriyor — iş insanı elleri fotoğrafı. Belge kendi içinde çelişiyor.
Sonradan kullanıcı isteğiyle tarife uyan bir doku üretildi; eski dosya duruyor.

---

## Denetimde bulunup düzeltilen gerçek hatalar

| Hata | Nasıl bulundu | Durum |
|---|---|---|
| Sayfa "50 atölye" diyordu, akordeon başlıkları 53 veriyordu | sayım karşılaştırması | ✅ tek doğru kaynağa bağlandı |
| Belgenin iç notu (satır 348) sayfada yayındaydı | agent denetimi | ✅ kaldırıldı |
| İki PDF `afloday.com/images/…` mutlak adresle bağlıydı, DNS geçişinde 404 verecekti | agent denetimi | ✅ indirildi, göreli yapıldı |
| `/galeri` başlığı "Atölyelerden kareler" kaynaksızdı | metin kaynağı ölçümü | ✅ belgedeki ada çevrildi ("Galeri") |
| 5 sayfanın `og:image` dosyası diskte yoktu | SEO denetimi | ✅ 1200×630 kapaklar üretildi |
| 11 sayfada yapılandırılmış veri yoktu | SEO denetimi | ✅ `layout()` varsayılan `@graph` üretiyor |
| `.istatistik-doku > picture` kuralı yoktu, telefonda doku bölümün üstteki 250px'inde kalıyordu | doku değişimi sırasında | ✅ düzeltildi |
| Işık kutusunda iki nesil CSS çakışıyordu (çift çarpı, beyaz baklava, kopmuş sayaç) | kullanıcı bildirimi | ✅ eski nesil kaldırıldı |
| Sonsuz şeritte kartlar boş kayıyordu (42'den 6'sı yüklü) | ölçüm | ✅ ilk 8 kart `eager` |
| Telefonda 14 sınıfta 10-11px metin | responsive denetim | ✅ 12.5px |

---

## Belgenin kendi eksikleri — Afloday'den istenecek

| # | Eksik | Belge satırı | Sitede şu an |
|---|---|---|---|
| 1 | **"Öne Çıkan 4 Vitrin Kartı"** deniyor, yalnız 2'sinin metni var (③ ve ④ hiç yazılmamış) | 111-117 | 2 kart — belgede ne varsa o |
| 2 | **%88 istatistiğinin kaynağı yok** (diğer üçünde Deloitte / Gallup / Korn Ferry var) | 51 | kaynaksız basılıyor, uydurulmadı |
| 3 | **KVKK ve çerez aydınlatma metinleri** belgede hiç yok | — | sayfa üretilmiyor, formlar gösteri modunda |
| 4 | **Hero videosu** gönderilmedi (klasörde video dosyası yok) | — | geçici AI videosu duruyor |

---

## Doğrulama komutları

```bash
node _build/verify.mjs      # 20 sayfa · görsel · bağlantı · 0 sorun
npm run build               # üretim derlemesi
```

Denetim betikleri `scratchpad/` altında: `bolum.mjs` (belge bölümü ↔ sayfa),
`hucre-ac.mjs` (dev tablo hücreleri), `yonerge.mjs` (9 yerleşim yönergesi),
`envanter-tam-dogrula.mjs` (Excel 35 satır), `responsive.mjs` (6 ekran sınıfı),
`a11y.mjs`, `canli.mjs`, `seo.mjs`, `metin-kaynagi.mjs`.
