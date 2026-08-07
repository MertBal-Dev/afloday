# Afloday — premium tasarım turu, tasarım belgesi

> 6 Ağustos 2026 · İsmail Mert Bal ile birlikte kararlaştırıldı
>
> Hedef: 31 üretilen sayfanın (34 canlı adres) tamamı, Ceylan hanımın
> 5 Ağustos geri bildirimine uygun, ölçülebilir kalite eşiklerini geçen
> bir tasarıma taşınacak.

---

## 1 · Neden bu tur gerekiyor

Geri bildirim turu 5-6 Ağustos'ta uygulandı ve yayına alındı, ama kapsamı
eşit dağılmadı. `git diff 4b9ea9c..6ad03b8` ölçümü:

| Grup | Sayfa | Değişen satır | Gerçekte ne oldu |
|---|---|---|---|
| Yeniden tasarlandı | 14 | 366-1169 | etkinlik ve eğitim sayfaları kuruldu |
| Kısmi dokunuş | 4 | 31-103 | index, hakkimizda, gelecegi-tasarla, kurumsal |
| **Dokunulmadı** | **13** | **13-17** | **yalnız kalıp: önbellek damgası, menüden Galeri çıkışı, `tabindex`, başlık sonu noktası** |

13 sayfa geri bildirimden hiç nasibini almadı. Bunlar:
`gulumseyen-yarinlar-projesi`, `surdurulebilirlik`, `sosyal-sorumluluk-is-danismanligi`,
`ik`, `iletisim`, 7 ekip sayfası, `404`.

Ayrıca üç yapısal sorun ölçüldü:

1. **Kırpma.** CSS'te 8 farklı oranda 53 sabit çerçeve var. Fotoğraf havuzu
   çift tepeli: %40 dikey, %19 kare, %42 yatay. Hangi oran seçilirse seçilsin
   ortalama %24-53 kırpma çıkıyor.
2. **Mobil okunabilirlik.** 390px'te 13 sayfada 49 metin bloğu satır başına
   26 karakterin altında. En dar bloklar 113px, 137px, 141px genişlikte.
   Rahat okuma 45-75 karakter/satır.
3. **Üç kuşak ölü palet kodu.** `.btn-primary` 3 kez, `--carmine` 3 kez,
   `--bronze` 4 kez, `--rule` 5 kez tanımlı. `:root` dışında 87 ham hex.

---

## 2 · Bağlayıcı kaynaklar

Öncelik sırası. Çakışma olursa üstteki kazanır.

1. **`docs/kaynak/geri-bildirim-2026-08-05.md`** — Ceylan hanımın kelimesi
   kelimesine geri bildirimi. Yerleşim kararlarında en üstte.
2. **`docs/kaynak/belge-tam.txt`** — 4 Ağustos içerik belgesi, 551 satır.
   İçeriğin kaynağı.
3. **`_audit/orijinal/`** — canlı afloday.com'un 34 sayfalık metin dökümü.
   İçeriğin ikinci kaynağı.
4. **`docs/kaynak/envanter.tsv`** — 34 canlı adres, korunması zorunlu.

**İçerik kuralı değişmiyor:** sitedeki her cümle ya belgede ya da eski site
dökümünde geçmeli. Rakam, rozet, referans, istatistik uydurma yok. Bu tur
**yerleşim ve tasarım** turudur, içerik yazma turu değil.

### Geri bildirimin karşılanmamış maddeleri

Önceki turun 14 maddelik özetinde olmayan veya daralmış olanlar:

| Ceylan hanımın sözü | Durum |
|---|---|
| "Genel olarak kayboldum sayfalarda" | hiç ele alınmadı — gezinme/yönelim |
| "Ara yönlendirmeler ... onlar olmasın" | sayaç olarak dar yorumlandı |
| "görsellerin üzerinde olabilir yazılar" | kısmen |
| naregitim.com/cozumlerimiz referansı | incelendi, aşağıda |
| "yarın 11:00'e kadar uygun olacağım" | yanıtlanmadı |

---

## 3 · PASS tanımı

"Hazır" öznel bir kelime. Bu turda PASS şu ölçülebilir kapıların tamamıdır.
Her sayfa, her kapıdan geçmeden teslim edilmiş sayılmaz.

| # | Kapı | Ölçen | Eşik |
|---|---|---|---|
| P1 | Sayfa, görsel, bağlantı bütünlüğü | `_build/verify.mjs` | 0 sorun |
| P2 | Statik erişilebilirlik | `_audit/denetim/a11y.mjs` | 0 bulgu |
| P3 | Her sayfaya erişilebiliyor | `_audit/denetim/erisim.mjs` | 0 erişilemeyen |
| P4 | SEO: sitemap, OG, JSON-LD | `_audit/denetim/seo.mjs` | 0 bulgu |
| P5 | **Kırpma** | `_audit/denetim/oran.mjs` | **%0** — hiçbir fotoğraf kesilmiyor |
| P6 | **Mobil metin genişliği** | `_audit/denetim/mobil.mjs 390` | 390px'te hiçbir metin bloğu **320px'ten dar değil** |
| P7 | **Mobil satır yoğunluğu** | `_audit/denetim/mobil.mjs 390` | gövde metni **≥35 karakter/satır** |
| P8 | Kontrast, hesaplanmış renkle | `_audit/denetim/mobil.mjs` B bölümü | WCAG AA, gerçek ihlal 0 |
| P9 | 320px yatay taşma | tarayıcı denetimi | 0 sayfada taşma |
| P10 | 34 canlı adres korunuyor | `envanter.tsv` karşılaştırması | 34/34 |
| P11 | Palet tekilliği | `_audit/denetim/palet-oku.mjs` | her token **1 kez** tanımlı, `:root` dışında ham hex **0** |
| P12 | Görünüm regresyonu | 31 sayfa × 3 genişlik piksel karşılaştırma | yalnız kasıtlı farklar |

P5, P6, P7, P11 bu turda yeni. Diğerleri zaten geçiyor ve geçmeye devam etmeli.

---

## 4 · Tasarım sistemi

### 4.1 · Renk token katmanı

**Sorun.** Palet üç kez üst üste yamandı. Token adları artık yalan söylüyor:
`--carmine` turuncu tutuyor, `--bronze` haki tutuyor. Ölü tanımlar dosyada
duruyor ve her sayfa yüklenişinde hesaplanıp eziliyor.

**Çözüm.** Palet `_build/palet.mjs` içinde tek kaynak olur, `:root` oradan
üretilir. Token adları rolü anlatır, rengi değil.

```js
export const palet = {
  zemin:     '#EBE7DB',   // sayfa zemini
  yuzey:     '#F4F1E7',   // kart, yüzey
  murekkep:  '#131A15',   // gövde metni
  soluk:     '#5C6158',   // ikincil metin
  eylem:     '#131A15',   // düğme zemini
  eylemUst:  '#F4F3EC',   // düğme yazısı
  vurgu:     '#2F6A2E',   // italik başlık, kart çizgisi, ok
  etiket:    '#6B6340',   // göz kırpma, etiket
  odak:      '#C6401A',   // odak halkası
  bant:      '#131A15',   // koyu bant zemini
  bantYazi:  '#F4F3EC',
  bantVurgu: '#F05625',   // koyu bantta turuncu, 5.11:1
  cizgi:     '#CFC9B9',
};
```

**Değişmeyen kurallar** (CLAUDE.md'den, kaynağı Ceylan hanım):
- Ağırlıkta yeşil, turuncu vurgu.
- **Turuncu asla metin rengi olamaz** — krem üzerinde 2.84:1. Koyu bantta serbest.
- Odak halkası ayrı token; tek değerle hem krem hem koyu zeminde 3:1 geçmeli.

**Bu adım görünümü değiştirmez.** Çıkan renkler bugünkü hesaplanmış
değerlerin aynısı. P12 piksel karşılaştırması bunu doğrular.

Karar denemeleri (CSS'teki uzun yorum blokları) `docs/palet-gerekce.md`'ye
taşınır. CSS'te kalan tek şey token ve kural olur.

### 4.2 · Görsel yerleşim sistemi — kırpma yok

**Karar: hiçbir fotoğraf kırpılmayacak.** Sabit oranlı çerçeve kullanılmayacak.
Yerine iki sistem, ikisi farklı işte.

#### Elenen seçenekler — ölçülüp reddedildi

Üç aday prototiplendi ve gerçek fotoğraflarla sınandı
(`_audit/rapor/kiyas-A.png`, `-B.png`, `-C.png`).

**A · Paspartu levha.** Her kart aynı dış oranda, fotoğraf içine doğal oranıyla
monte ediliyor. Kırpma %0, dış geometri tek tip. **Reddedildi:** kart ortalama
%58 dolu, %42'si paspartu. Görselde küçük fotoğraflar dev boş alanda yüzüyor,
kartlar birbirini tutmuyor. Kasıtlı değil, bozuk duruyor.

**B · Dolu kart, sabit oran.** Ceylan hanımın referansı (naregitim) bunu
yapıyor; derli toplu ve premium duruyor. **Reddedildi:** kırpma zorunlu.
Kart oranını kategoriye göre seçme denendi, kırpmayı %26.2'den ancak %20.3'e
indirdi (`_audit/denetim/kart-orani.mjs`); 60 fotoğrafın 35'i hâlâ %20'den
fazla kesiliyor. Tek bir kategorinin kendi içinde bile dikey ve yatay karışık.

**Hizalı satır (justified rows).** Kırpma %0, satır yüksekliği sapması %8.8.
**Reddedildi:** dış geometri tek tip değil, kart genişlikleri satır içinde
oynuyor. Daha da önemlisi, Ceylan hanımın şikâyeti hizalama değil, fotoğrafların
içerikten kopuk bir yığın hâlinde altta durmasıydı. Hizalı satır daha düzgün
bir yığın yapar, yığın olmaya devam eder.

**Sonuç: kart ızgarası fotoğraf aracı olmaktan çıkıyor.** Kırpmasızlık ile
tek tip kart geometrisi aynı anda olmuyor; bu geometrik bir gerçek, tercih
değil. Kırpmasızlık şart koşulduğu için ızgara düşüyor.

7 kategori için ızgara zaten gereksiz. Izgara 20+ öğe içindir. Yedi öğe
üst üste editoryal bant olarak daha ferah ve daha premium durur.

#### Editoryal bant — tek sistem

Fotoğrafın doğal oranı bandın tipini **seçer**. Çerçeve fotoğrafa uymaz,
kompozisyon fotoğrafa uyar.

| Fotoğraf oranı | Bant tipi | Havuzdaki pay |
|---|---|---|
| < 0.85 dikey | iki sütun: fotoğraf yanda, metin yanına akar | %40 |
| 0.85 - 1.18 kare | ortalanmış fotoğraf, altında dar ölçüde metin | %19 |
| > 1.18 yatay | tam kanamalı, metin üzerinde, altında degrade karartma | %42 |

Bant tipi yapı zamanında `sharp` metadata'sından otomatik atanır. Elle
sınıflandırma yok.

**Karmaşa neden doğmuyor:** fotoğraflar yan yana gelmiyor. Her fotoğrafın
komşusu başka bir fotoğraf değil, metin. Oran farkı bu yüzden karmaşa değil
ritim okunuyor. Ahenk bantların tekrar eden yapısından gelir: aynı kenar
boşluğu, aynı etiket dili, aynı dikey ritim.

Bu, Ceylan hanımın dört isteğini aynı anda karşılıyor:
- "görseller altta word düzeni gibi olmuş" → fotoğraf artık altta yığın değil,
  kendi metniyle eşleşiyor
- "metin, görsel, yazı yazı gidiyor daha dinamik olabilir" → bant sırası
- "aralara görseller girebilir" → bant tam da bu
- "görsellerin üzerinde olabilir yazılar" → yatay bant

Prototiple doğrulandı (`_audit/rapor/kiyas-C.png`).

**Kabul edilen maliyet:** bant başına bir fotoğraf düştüğü için sayfalar
uzar. Karşılığında kırpma sıfır. Sayfa uzunluğu, bant yüksekliklerinin
sıkılaştırılması ve gereksiz bantların ayıklanmasıyla yönetilir; kırpma
geri getirilerek değil.

#### Fotoğraf üzerindeki metin

Yatay bantta ve panel kartlarında metin fotoğrafın üzerinde durur.
**Degrade karartma zorunlu** — bugün yok ve "Yaratıcı Düşünme" kartında krem
yazı parlak fotoğrafta okunmuyor. Karartma alt %70'te
`rgba(19,26,21,0) → rgba(19,26,21,.78)`, kontrast hesaplanmış renkle sınanır (P8).

### 4.3 · Mobil okunabilirlik

**Sorun.** 390px'te 49 metin bloğu dar sütuna sıkışmış. En kötüleri 113px,
137px, 141px genişlikte. Kullanıcının tarifi: "dikine çok uzunlar, yatayda
çok kısa kalmışlar, okumak için çok kaydırıyoruz."

**Kural.** 760px altında çok sütunlu her yerleşim tek sütuna düşer. İstisna
yok. Panel şeridi, mozaik, vitrin kartları, vizyon/misyon, hepsi.

**Eşikler** P6 ve P7: 390px'te hiçbir metin bloğu 320px'ten dar olmayacak,
gövde metni satır başına en az 35 karakter taşıyacak.

Panel şeridi bugün 390px'te iki sütunda kalıyor; başlıklar üç satıra kırılıyor,
"Eğitimi" kelimesi ok düğmesinin üzerine biniyor, son satırda boş hücre kalıyor.
Tek sütun bunların üçünü birden çözüyor.

### 4.4 · Gezinme — "kayboldum" sorunu

Geri bildirimin hiç ele alınmamış maddesi. Ceylan hanım 31 sayfalık bir sitede
nerede olduğunu takip edemiyor.

Bu maddeyi tahminle çözmek istemiyoruz. **Ceylan hanımın satır satır geri
bildirim teklifi burada kullanılacak** (bkz. 7 · Açık uçlar). Yine de tahmine
dayanmayan üç düzeltme şimdiden yapılabilir:

- Her sayfada nerede olunduğunu gösteren bir konum satırı (breadcrumb),
  belgede karşılığı olan başlıklarla.
- Kategori ve alt sayfalar arasında ileri/geri gezinme; bugün yalnız bazı
  sayfalarda var.
- Menüde bulunulan bölümün işaretlenmesi; `aria-current` bazı sayfalarda var,
  görsel karşılığı zayıf.

---

## 5 · Sayfa envanteri

31 üretilen sayfa. "Bu turda" sütunu yapılacak işin ağırlığını gösterir.

| Sayfa | Geri bildirim turunda | Bu turda |
|---|---|---|
| `gulumseyen-yarinlar-projesi` | 15 (kalıp) | **tam tasarım** |
| `surdurulebilirlik` | 15 (kalıp) | **tam tasarım** |
| `sosyal-sorumluluk-is-danismanligi` | 15 (kalıp) | **tam tasarım** |
| `ik` | 15 (kalıp) | **tam tasarım** |
| `iletisim` | 17 (kalıp) | **tam tasarım** |
| 7 ekip sayfası | 17 (kalıp) | **tam tasarım** |
| `404` | 13 (kalıp) | gözden geçir |
| `index` | 31 | mobil + kırpma + gezinme |
| `hakkimizda` | 65 | vizyon/misyon bandı, mobil |
| `gelecegi-tasarla` | 73 | element haritası, mobil |
| `kurumsal` | 103 | mobil + kırpma |
| 5 eğitim sayfası | 366 | mobil + kırpma |
| 7 etkinlik sayfası | 432-492 | mobil + kırpma + panel şeridi |
| `doga-temelli-egitimlerimiz` | 477 | panel şeridi mobil, karartma |
| `dogadan-hobi-atolyeleri` | 1169 | mozaik → hizalı satır |

---

## 6 · Aşamalar

Her aşama kendi PASS kapılarından geçmeden bir sonrakine geçilmez.

**Aşama 0 · Renk token katmanı**
`_build/palet.mjs`, `:root` üretimi, üç override bloğunun silinmesi, 87 ham
hex'in token'a bağlanması. Görünüm değişmez.
Kapılar: P1, P2, P11, P12.

**Aşama 1 · Görsel yerleşim motoru**
Hizalı satır bileşeni, üç editoryal bant tipi, oran sınıflandırıcısı,
karartma katmanı. Sabit oranlı 53 çerçevenin kaldırılması.
Kapılar: P1, P5, P8, P12 (bu aşamada kasıtlı fark bekleniyor).

**Aşama 2 · Mobil tek sütun kuralı**
760px altı tek sütun, panel şeridi dahil. 49 dar bloğun giderilmesi.
Kapılar: P6, P7, P9.

**Aşama 3 · 13 dokunulmamış sayfa**
Yeni sistemle tam tasarım. İçerik kaynaklı kalır, yalnız yerleşim kurulur.
Kapılar: hepsi.

**Aşama 4 · Gezinme**
Konum satırı, ileri/geri, menü işareti. Ceylan hanımın satır satır geri
bildirimi geldiyse ona göre.
Kapılar: P3, hepsi.

**Aşama 5 · Bütün site geçişi**
31 sayfa × 12 kapı. Eksiksiz PASS.

---

## 7 · Riskler ve açık uçlar

| Konu | Durum |
|---|---|
| **"Kayboldum" maddesi** | Tahmine açık. Ceylan hanımın satır satır geri bildirimi alınmalı. |
| **Ceylan hanımın görüşme teklifi** | 5 Ağustos tarihli, yanıtlanmadı. Cevap verilmeli. |
| Vitrin kartı 3 ve 4 metinleri | Afloday'den bekleniyor. Anasayfa eksik kalıyor. |
| %88 istatistiğinin kaynağı | Bekleniyor. |
| Hangi fotoğraf hangi atölye | Kategori düzeyi çözüldü (7 kategori, dosya adlarından). Atölye düzeyi yok: 53 atölyenin yalnız 2'sinin adlı fotoğrafı var. |
| KVKK ve çerez metni | Müşterinin sorumluluğu. `kvkk.mjs` `hazir:false`. |
| Site yayında, Ceylan hanım haberdar değil | Her push ona anında yansır. |

### Kullanılmayan görsel havuzu

Kaynak arşivdeki `Diğer Görseller` klasörü (132 dosya, 1.2 GB) yapı
akışına hiç bağlı değil — `_build/gorsel-hazirla.mjs` yalnız
`Seçilmiş Olanlar`, `Doğadan Etkinlik Atölye Deneyimleri` ve `Galeri`
klasörlerini okuyor. 13 sayfanın tasarımı için ek malzeme gerekirse
ilk bakılacak yer burası.

---

## 8 · Bu belgenin dışında kalanlar

- **Faz 2: blog + `/admin` paneli.** Ayrı iş, taahhüt en geç 3 hafta.
- **Ceylan hanımın renk paneli.** Aşama 0 bittikten sonra planlanacak;
  `palet.mjs` tek kaynak olduğu için panelin çıktısı doğrudan o dosya olur.
- **DNS geçişi.** cPanel erişimi bekleniyor.
