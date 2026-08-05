# Denetim betikleri

Hepsi bağımsız çalışır, hiçbiri projeyi değiştirmez — sadece ölçer ve raporlar.

## Kurulum (yeni bilgisayarda bir kez)

Betiklerin çoğu tarayıcı gerektiriyor. `playwright-core` projeye değil,
geçici bir klasöre kurulur ki depo temiz kalsın:

```bash
mkdir -p /tmp/afloday-denetim && cd /tmp/afloday-denetim
npm init -y && npm i playwright-core
```

Sonra betikleri oradan çalıştır (yolları mutlak yazılmış, düzenlemen gerekebilir).
Kurulu Chrome kullanılıyor: `chromium.launch({ channel: 'chrome' })`.

Önce önizleme sunucusunu aç: `node _build/onizle.mjs 8899`

## Betikler

| Dosya | Ne yapar |
|---|---|
| `bolum.mjs` | Belgenin bir bölümünü ilgili sayfayla satır satır karşılaştırır.<br>`node bolum.mjs 1 117 index.html` |
| `hucre-ac.mjs` | Belgenin dev tablo hücrelerini açıp parça parça arar (satır 121 gibi).<br>`node hucre-ac.mjs 121 kurumsal.html` |
| `yonerge.mjs` | Belgenin 9 yerleşim yönergesi uygulandı mı, kod üzerinden sınar |
| `envanter-tam-dogrula.mjs` | Excel envanterinin 35 satırını siteyle karşılaştırır |
| `metin-kaynagi.mjs` | Sitedeki her metni belge ve canlı döküme karşı sınıflandırır |
| `a11y.mjs` | Statik erişilebilirlik taraması (tarayıcı gerekmez) |
| `canli.mjs` | Kontrast, konsol hatası, kırık görsel — 20 sayfa × 4 genişlik |
| `responsive.mjs` | 6 ekran sınıfı: 390 / 768 / 1366 / 1920 / 2560 / 3840 |
| `gorunmez.mjs` | Kaydırdıktan sonra hâlâ görünmeyen bölüm var mı |
| `seo.mjs` | title, description, canonical, OG, JSON-LD, sitemap |
| `sahipsiz.mjs` | Hiçbir yerden referans verilmeyen varlıkları bulur |
| `erisim.mjs` | Hiçbir yerden bağlantı almayan sayfa var mı |
| `cikar.py` | Kaynak .docx'ten metni yeniden çıkarır (tablolar dahil) |

## Önemli uyarı

`gorunmez.mjs` dışındaki tarayıcı betikleri `data-reveal` opaklığını 1'e
zorluyor. Bu, **açığa çıkarma hatalarını gizler** — nitekim bir kez gizledi:
telefonda 7935 pikselllik akordeon kalıcı olarak görünmez kalmıştı ve
denetimler "sorun yok" diyordu. Görünürlük sorunu ararken `gorunmez.mjs`
kullan, o gerçek kullanıcı gibi kaydırıp sonra bakıyor.
