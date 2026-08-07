# Geri bildirim denetimi — madde madde, ölçümle

> 7 Ağustos 2026 · Kaynak: `docs/kaynak/geri-bildirim-2026-08-05.md`
> Ölçen: `node _audit/denetim/geri-bildirim.mjs` (31 sayfa × 1440px ve 390px)
>
> Bu belge "hangi madde karşılandı, hangisi karşılanmadı" sorusunun
> ölçülmüş cevabıdır. `devam-plani.md`'deki 14 maddelik özet tablo
> önceki oturumun iddiasıydı; burada iddialar sınandı ve **ikisi çürüdü**.

---

## Karşılanan maddeler

| # | Ceylan hanımın sözü | Ölçüm |
|---|---|---|
| 1 | "İlk bakışta çok büyük büyük geldi" | masaüstü en büyük başlık **71px**, başlık/gövde oranı **3.9** · telefon 36px. Eskiden 120px ve 8:1'di. |
| 5 | "eski logo rengi var, yeni renk turuncu yeşil" | karmen ve bronz **0 öğede**. |
| 8 | "Açılan ana menüde başlıklar çok büyük" | telefonda menü maddesi **12px** (eskiden 31px). |
| 9 | "5 eğitimi sayfaya sığdırsak" | `doga-temelli-egitimlerimiz` **4.2 ekran** (eskiden 11.7). |
| 11 | "Galeri sayfasını kapatabiliriz" | `galeri.html` üretilmiyor, `/galeri` 301 ile yönleniyor. |
| 13 | "vizyon, misyon alt alta" | masaüstünde **yan yana**: ikisi de `hk-ikili-ic`, aynı `y=2205`, `x=65` ve `x=734`, 572px. Telefonda alt alta, doğrusu bu. |

---

## Karşılanmayan maddeler

### 12 · "Görseller altta word düzeni gibi olmuş, amatör duruyor" ❌

En somut ihlal. Arka arkaya gelen, aralarında metin olmayan fotoğraf yığınları:

| Sayfa | Üst üste fotoğraf | Yığının başladığı yer |
|---|---|---|
| `index` | 42 | sayfanın %75'i |
| `gulumseyen-yarinlar-projesi` | **12** | %61 |
| `etkinlik-gonulluluk` | 8 | %18 |
| `dogadan-hobi-atolyeleri` | 7 | %41 |
| `doga-temelli-egitimlerimiz` | 5 | %26 |
| `hakkimizda` | 4 | %61 |
| `etkinlik-ozel-gun` | 3 | %70 |

`index`'teki 42, sonsuz kayan şerit; kasıtlı ve şikâyetin konusu değil.
Diğer 6 sayfa doğrudan Ceylan hanımın tarif ettiği yığın.

### 2 · "Sayfalarda boşluklar da çok" ❌

| Ekran | Eşik | Aşan sayfa |
|---|---|---|
| Masaüstü | 8 ekran | **9 sayfa** |
| Telefon | 10 ekran | **11 sayfa** |

En uzunlar (telefon): `gelecegi-tasarla` **18.0**, `etkinlik-wellbeing` 14.5,
`hakkimizda` 14.2, `etkinlik-surdurulebilirlik` 13.0, `etkinlik-cocuk` 12.8.

Bu madde 10. maddeyi de açıklıyor: 18 ekran boyunca kaydıran biri
"kayboldum" der. Ayrı bir gezinme sorunu aramaya gerek yok.

### 14 · "Referans logoları en az iki katı kadar büyüyebilir" ✅

**Bu madde önce yanlışlıkla "karşılanmadı" işaretlendi; düzeltildi.**

Ölçüm `hakkimizda` sayfasındaki `.marquee` kayan şeridini bulmuştu (30px)
ve onu referans logosu sandı. Referans logoları aslında `index.html`
içindeki `.logos` ızgarasında ve **30 logonun hepsi masaüstünde 64px,
telefonda 50px**. Yani 32 → 64, iki katı, yapılmış.

Ders: aynı içeriği taşıyan iki bileşen varsa denetim betiği hangisini
ölçtüğünü söylemeli. `geri-bildirim.mjs` artık `.logos` ızgarasına bakıyor.

---

## Yanlış pozitifler — ölçüm çıkardı, inceleyince madde değil

Bunlara zaman harcanmasın diye kayda geçiyorum.

| Madde | Ham ölçüm | Neden madde değil |
|---|---|---|
| 4 · başlık sonu noktası | 3 sayfada bulundu | Üçü de tam cümle: "Bu kayıt katalogda yok.", "Başvurunuz elimize ulaştı.", "Teşekkürler! Talebiniz elimize ulaştı." Ceylan hanımın kastı **başlık** sonundaki süs noktasıydı, durum mesajı değil. |
| 3 · sayaçlar | "24 atölye", "10 yıl" | "24 atölye" belgeden gelen tam cümlenin içinde: *"her ay 2, yılda 24 atölye ile 1000'den fazla…"*. "10 yıl" ekip özgeçmişinde. Ceylan hanımın kastı **ara yönlendirme bloklarındaki** sayaçlardı, onlar kaldırılmış. |
| 10 · "kayboldum" | 3 sayfada konum göstergesi yok | `index` ve `404`'te zaten gerekmez. Gerçek sebep 2. madde: sayfa uzunluğu. |

---

## Göz gerektiren, henüz karara bağlanmamış

| # | Madde | Not |
|---|---|---|
| 6 | "görseller küçülüp yazılar büyüyebilir, orantılı olsun" | Ölçüt belirsiz; Ceylan hanımın onayı gerekir. |
| 7 | "metin görsel yazı yazı, daha dinamik olabilir" | 12. madde çözülünce büyük ölçüde çözülür. |

---

## Öncelik sırası

1. **12 · fotoğraf yığınları** — 6 sayfa. Editoryal bant sistemi bunun cevabı.
2. **2 · sayfa uzunluğu** — 11 sayfa telefonda 10 ekranı aşıyor. 10. maddeyi de kapatır.
3. **14 · logo boyutu** — tek satırlık CSS düzeltmesi, 36 → 64px.

1 ve 2 aynı işte birleşiyor: yığını banda çevirmek hem 12'yi çözer hem
sayfayı kısaltır, çünkü yığındaki her fotoğraf kendi metniyle eşleşir ve
araya giren boş bölümler kalkar.

---

## 7 Ağustos gece turu — Playwright ile sayfa sayfa inceleme

### ÖNEMLİ: kırpma ölçümü tuzağı

Kırpma sayısı koşumdan koşuma 1 → 6 → 15 diye değişti. Sebep tembel
yükleme: yüklenmemiş görselin `naturalWidth` değeri 0 ve ölçüm onu
atlıyor. **Ne kadar çok görsel yüklenmişse o kadar çok kırpma sayılıyor.**

Doğru ölçüm için üçü birden gerekiyor:

```js
for (const i of document.images) i.loading = 'eager';   // tembelliği kapat
/* sayfayı baştan sona kaydır */
await Promise.all([...document.images].map(i =>
  (i.complete && i.naturalWidth > 0) ? null
    : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 6000); })));
```

Sonra `yuklenmeyen: 0` olduğunu doğrula. Bu yapılmadan verilen kırpma
sayısı **eksik** çıkar ve sahte iyileşme raporlanır.

### Sayfa sayfa sonuç (390px)

| Sayfa | Sonuç | Ölçüm |
|---|---|---|
| `index` | PASS | 16.9 ekran · kontrast 0 · turuncu metinler koyu bantta 6.29:1 |
| `hakkimizda` | PASS | 13.9 ekran · kontrast 0 · kırpma 0 · vizyon/misyon masaüstünde yan yana |
| `gelecegi-tasarla` | PASS | 16 ekran ama boşluk sayfanın **%6'sı** (48px bölüm iç boşluğu). Uzunluk içerik hacminden, boşluktan değil. Belgenin 4 pencere görselinin dördü de yerinde. |
| `gulumseyen-yarinlar-projesi` | PASS | yeniden kuruldu · **11 görsel, kırpma 0** (tam yükleme ile doğrulandı) · desen MFMFMF… · foto yığını 12→3 |
| `dogadan-hobi-atolyeleri` | PASS | panel hatası düzeltildi, 7 kategori de görünüyor |
| `doga-temelli-egitimlerimiz` | PASS | 5 panel, 6 ekran, hepsi temiz |
| `kurumsal` | PASS | 12.7 ekran · kontrast 0 · "7 fotoğraf yığını" YANLIŞ POZİTİF: `kat-gezinme-medya`, yani kategori gezinme kartları |
| `sosyal-sorumluluk-is-danismanligi` | **FAIL** | 11.5 ekran · **8 metin bloğu arka arkaya** · toplam yalnız 3 görsel. Sitedeki en ağır "yazı yazı". |
| `etkinlik-*` (7 sayfa) | **KISMİ** | dar metin 9→0 düzeltildi · ama **18 görselin 15'i kırpılıyor, ortalama %19** (eski mozaik sabit çerçeveleri) |

### Bu turda düzeltilenler

1. **Panel şeridi telefonda 7 kategoriden 1'ini gösteriyordu.** `.pserit`
   sabit yükseklikli yatay şerit (`height: clamp(400px,46vh,620px)` +
   `overflow: hidden`); tek sütuna indirilince kap büyümüyor, altı paneli
   kesiyordu. Yalnız gözle yakalandı. `doga-temelli-egitimlerimiz`'i de
   etkiliyordu.
2. **Proje kapağı %44 kırpılıyordu** — 800×600 yatay fotoğraf 3/4 dikey
   çerçevede. `width="800" height="900"` özniteliği de yanlıştı.
3. **Açık zeminde metin kontrastı 1.93:1.** `.proje-bant-metin` rengi koyu
   bant için yazılmış, açık zeminde de kullanılmıştı. Artık `.field`
   içinde ayrı.
4. **Atölye kartı iç boşluğu** telefonda metne 277px bırakıyordu
   (`padding: clamp(28px,2.8vw,44px)`). 7 etkinlik sayfasında 9 dar blok
   → 0.

### Denenip GERİ ALINAN

`.mz-foto` telefonda doğal orana bağlanmak istendi. **İşi kötüleştirdi:**
kırpma 1'den 6'ya çıktı. Sebep CSS özgüllüğü — `.mz-bant .mz-foto img`
(0,3,0) benim `.mz-foto img` (0,2,0) kuralımı eziyor, `object-fit: cover`
kalırken kutu oranı `auto` olunca uyumsuzluk büyüyor. CLAUDE.md bu tuzağı
zaten yazıyordu. Geri alındı.

Etkinlik sayfalarındaki kırpmayı çözmek için `.mz-foto` ve `.mz-bant`
kurallarının **tamamı birlikte** ele alınmalı; tek kural eklemek yetmiyor.
Bu seçici için CSS'te 9 ayrı kural var.

---

## Çözülen: Koruncuk fotoğrafları eski siteden tam boyutta alındı

**7 Ağustos.** `gulumseyen-yarinlar-projesi` sayfasının 12 fotoğrafı
220×220px idi ve kullanılamaz durumdaydı. Kaynak arşivinde karşılıkları
yok — o sayfanın içeriği 4 Ağustos belgesinden değil, eski siteden geliyor
(belgede "Gülümseyen Yarınlar" bölümü yok, Koruncuk yalnız sosyal
sorumluluk metninde bir kez geçiyor).

Eski site hâlâ yayında ve dosyaların tam boyutlu hâlleri orada duruyordu:
`/images/afloday/atolye-koruncuk/01s.jpg` küçük hâli, **`01.jpg` tam hâli**.
"s" soneki "small" demekmiş.

| | Önce | Sonra |
|---|---|---|
| Çözünürlük | 220×220 | 563×750 – 800×717 |
| Oran | hepsi kare | **doğal oranlar** (yatay ve dikey) |
| Sayfa ortancası | 220px | **800px** |

İkinci satır birincisinden önemli: 220×220'ler **kare kırpmalardı**. Yani
fotoğraflar zaten kırpılmış hâlde kullanılıyordu. Tam boyutlular kırpılmamış
geldi, bu da kırpmasız bant sistemine doğrudan hizmet ediyor.

`_build/gorseller.mjs` yeni dosyalara yönlendirildi, ölçü manifestosu
170 → **182 kayıt**.

600px altı görseli olan sayfa sayısı 6 → **4**'e indi.

## Görsel çözünürlüğü — kalan engel

`_audit/denetim/gorsel-kalite.mjs` (logolar hariç):

| Sayfa | Durum |
|---|---|
| `gulumseyen-yarinlar-projesi` | 13 fotoğrafın 12'si **220×220px**, kullanılamaz |
| `hakkimizda` kapak | doğal **746px**, sayfada **1440px** gösteriliyor, iki kat büyütme |
| `iletisim`, `ik`, `404` | hiç fotoğraf yok |
| `zeynep-altunhan` 450px · `alara-apaydin-saruhan` 500px | sınırda |
| Diğer 20 sayfa | ortanca 800-1600px, sorun yok |

Yüksek çözünürlüklü asıllar kaynak arşivinde
(`wetransfer_afloday-web-metin-ve-gorseller_2026-08-04_1711`). Bant sistemi
fotoğrafı büyük gösterdiği için bu iki iş birlikte yapılmalı.
