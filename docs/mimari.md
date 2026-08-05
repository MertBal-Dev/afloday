# Mimari — neden böyle kurulu

Bu depoyu ilk açan bir geliştirici haklı bir soru sorar: **"React burada
render için kullanılmıyorsa Next.js neden var?"** Cevabı burada.

## Kısa hâli

```
_build/*.mjs   →  HTML dizgesi üretir  →  app/[[...slug]]/page.tsx basar
```

Sayfa gövdeleri React bileşeni değil. `_build/build.mjs` her sayfanın
gövdesini bir HTML dizgesi olarak üretiyor, Next.js'in yakalayıcı rotası
bunları `dangerouslySetInnerHTML` ile basıyor. CSS elle yazılmış tek bir
dosya, etkileşim bağımlılıksız tek bir JavaScript dosyası.

## Nasıl bu hâle geldi

Proje bağımlılıksız bir statik üreteç olarak başladı: düz Node, tek komut,
`site/` klasörüne 38 HTML sayfa. Sonrasında blog ve yönetici paneli kapsama
girince Next.js gerekli oldu. İki seçenek vardı:

1. Sayfaları TSX bileşenlere çevirmek
2. Mevcut üreteci Next.js'in içine sarmak

İkincisi seçildi. Gerekçe: tasarım piksel piksel doğrulanmıştı, içerik
müşteri belgesiyle satır satır eşleşiyordu ve teslim süresi kısaydı. Dönüşüm
2-3 gün ve gerileme riski demekti; sarmalama yarım gün sürdü.

## Bunun getirdikleri

**İyi tarafı.** Çıktı saf statik HTML. İçerik için istemcide sıfır React
çalışıyor. Google hazır HTML görüyor — müşterinin bir numaralı endişesi buydu.
Statik üreteç hâlâ tek başına çalışıyor (`node _build/build.mjs`), yani
Next.js bozulsa bile site üretilebilir.

**Bedeli.** Bileşen yeniden kullanımı React'in değil, şablon fonksiyonlarının
sorumluluğunda (`templates.mjs`). Prop tipleri yok; `icerik.d.ts` bu boşluğu
kısmen kapatıyor ama derleme zamanı zorlayıcı değil. Yeni gelen bir
geliştirici JSX bekler, şablon dizgesi bulur.

## Ne zaman değiştirilmeli

**Halka açık sayfalar için değiştirmeye gerek yok.** Statik, hızlı, denetimli
ve çalışıyor. Metin güncellemek için veri dosyasını düzenlemek yeterli.

**Blog ve `/admin` paneli TSX bileşenlerle yazılmalı.** İkisi de dinamik:
Supabase'den veri çekiyor, giriş arkasında çalışıyor, form durumu tutuyor.
Bunları şablon dizgesiyle yazmak yanlış olur. Sınır temiz:

```
statik tanıtım sayfaları  →  _build/ (bugünkü yapı)
blog + /admin             →  app/ altında gerçek React bileşenleri
```

İki yaklaşımın aynı depoda olması sorun değil; sınırın nerede olduğunun
yazılı olmaması sorundu, bu dosya onu gideriyor.

## Dönüşüm gerekirse

Tasarım sınıf adları üzerinden çalıştığı için (`afloday.css` değişmez),
dönüşüm mekanik: her `templates.mjs` fonksiyonu bir bileşene, her sayfa
bloğu bir sayfa bileşenine karşılık gelir. Veri dosyaları olduğu gibi kalır.
İçerik denetimleri üretilen HTML'e baktığı için dönüşüm sırasında da
çalışmaya devam eder — metin kayması olursa yakalanır.

Tahmini süre: 2-3 gün. Teslimden önce yapılmamalı.

## Değişmez kurallar

1. **İçerik uydurulmaz.** Sitedeki her cümle afloday.com'da ya da 4 Ağustos
   2026 içerik belgesinde geçer. Dizgi düzeltmeleri veri dosyalarının başında
   tek tek listeli.
2. **Adres eşleşmesi korunur.** `data.mjs` içindeki `canliAdres` tablosu ve
   `vercel.json` içindeki yönlendirmeler birlikte çalışır. Değişiklikten
   sonra `npm run dogrula`.
3. **Tailwind kurulmaz.** 74 KB'lık `afloday.css` tasarımın kendisi; köşe
   yuvarlaması yok, saç teli çizgi, serif başlık, bronz etiket, karmen vurgu.
4. **Görseller boru hattından geçer.** Ham fotoğraf doğrudan `site/assets`
   altına konmaz; `gorsel-hazirla.mjs` boyut ve biçim sınırlarını uygular.
