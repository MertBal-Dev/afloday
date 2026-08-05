# Görsel kaynakları

## istatistik-doku-kaynak.png (1536×1024)

Anasayfadaki "Neden Doğa Temelli Gelişim?" bölümünün arka plan dokusunun
ham hâli. AI ile üretildi; belge satır 54 "hafif doğa dokusu (yaprak/toprak
deseni)" istiyor ama 55. satırda kendi görselini iş insanı elleri fotoğrafı
olarak veriyor — belge kendi içinde çelişiyor, tarife uyan doku ayrıca üretildi.

**Saklanma sebebi:** AI çıktısı, birebir aynısı tekrar üretilemez. İleride
daha açık/koyu bir sürüm istenirse kaynak burada.

**Siteye nasıl geçti** (`_build/og-gorsel.mjs` mantığıyla aynı, elle):

```
sharp(kaynak).linear(1.9, 95)      → parlaklık 45 → 174
  .resize(1100).jpeg({quality:56, mozjpeg, progressive})   → 172 KB
  .resize(1100).webp({quality:42})                         → 238 KB
  .resize(800).webp({quality:60})                          → 150 KB
```

`linear(1.9, 95)` şart: ham görselin parlaklığı 45, bölüm zemini 24.
Aradaki fark %14 opaklıkta 1.5/255 kalıyor, yani görünmüyordu. Açılmış
hâlinde fark 26.5.

Çıktılar: `site/assets/img/rev2/secilmis/dogal-zemin-dokusu.*`
