# Afloday Rev. 2 — Mimari, Yayın ve Devir Planı

**Hedef:** Siteyi Next.js'e taşıyıp blog ve yönetici paneli eklemek, orijinal adresleri birebir koruyarak yayına almak, e-posta hizmetini kesintiye uğratmadan geçişi tamamlamak.

**Mimari:** Tek bir Next.js uygulaması. Halka açık sayfalar sunucuda üretiliyor (SEO için zorunlu), `/admin` altındaki panel giriş arkasında çalışıyor. Veri, kimlik doğrulama ve dosya depolama Supabase'de. Barındırma Vercel'de, Afloday'in kendi hesabında.

**Teknoloji:** Next.js · Supabase · Vercel

---

## Durum — 4 Ağustos 2026 akşamı

**İş bağlandı**, koşullar kapandı, **kapsam belgesi geldi.**

```
Bedel        20.000 TL (KDV dahil) · site + blog + panel, tek paket
Fatura       tek fatura, site yayına alındığında
Bakım        ilk 3 ay dahil · 3. ayın sonunda yıllık bedel birlikte belirlenecek
Teslim       site: erişimden sonra 3-4 iş günü · blog + panel: en geç 3 hafta
```

**Beklenen tek şey:** alan adı yönetimine erişim (cPanel). Sayaç o gün başlıyor.
**Teknik muhatap:** Hasan Basri Ünlü.

### Tamamlananlar

- ✅ Canlı siteden 34 adres çıkarıldı, HTTP durumlarıyla doğrulandı
- ✅ `canliAdres` tablosu — 34/34 adres birebir karşılanıyor
- ✅ `cleanUrls`, uzantılar düştü
- ✅ Anasayfa slaydı, daire açılımlı geçişle
- ✅ **Next.js taşıması bitti** — 37 sayfa üretiliyor, gövdeler statik sürümle
      **birebir aynı** (37/37 karşılaştırıldı), sitemap ve robots Next tarafında,
      `vercel.json` `out/` çıktısına göre güncellendi

---

## KAPSAM — 4 Ağustos 2026 tarihli içerik belgesi

`Afloday_WEB Sayfası Metinler_04082026.docx` · 65.000 karakter · 540 paragraf.
**Bundan sonrası bu belgeye göre yapılıyor.** Belgede ne yazıyorsa o.

### Konumlandırma değişti

```
ESKİ      Çiçek ve bitki hobi atölyeleri · bireysel müşteri
YENİ      Kurumsal eğitim ve gelişim · B2B · doğa temelli metodoloji
```

Sayfa sayısı azalıyor, **iş azalmıyor.** Atölye kataloğu, künye defteri ve 16
atölye sayfası siliniyor; yerine çok daha yoğun, tamamen yeni bölümler geliyor.

### Yeni site haritası — 16 sayfa

| Adres | Durum | İçerik |
|---|---|---|
| `/` | yenilenecek | tamamen yeni anasayfa |
| `/hakkimizda` | yenilenecek | yeni hikâye, vizyon, misyon, "Neden Doğa?" |
| `/doga-temelli-egitimlerimiz` | yenilenecek | **5 eğitim programı**, her biri derinlemesine |
| `/sosyal-sorumluluk-is-danismanligi` | yenilenecek | baştan yazıldı, istatistik + referanslar |
| `/gelecegi-tasarla` | yenilenecek | metin değişecek |
| `/gulumseyen-yarinlar-projesi` | OK | dokunulmuyor |
| `/iletisim` `/ik` | OK | dokunulmuyor |
| 7 ekip sayfası | OK | yalnızca `ceylan-kalyon` metni değişecek |
| **Doğadan Etkinlik Atölye Deneyimleri** | **YENİ SAYFA** | atölyeler burada kategori olarak |

**Karar bekleyen:** Yeni sayfanın adresi. Öneri: iptal edilen
`/dogadan-hobi-atolyeleri` adresi bu sayfaya verilsin — kavramsal olarak onun
yerine geçiyor ve o adresin arama değeri korunmuş olur.

### İptal edilen 19 adres ve yönlendirme hedefleri

```
16 atölye sayfası            →  Doğadan Etkinlik Atölye Deneyimleri
/katilim                     →  /iletisim
/dogadan-gelisim-atolyeleri  →  /doga-temelli-egitimlerimiz
/dogadan-hobi-atolyeleri     →  Doğadan Etkinlik Atölye Deneyimleri (ya da o olur)
```

Anasayfaya toplu yönlendirme yapılmıyor; her adres konusuna en yakın sayfaya gidiyor.

### Anasayfanın yeni bölümleri

1. **Hero — 3 dönen slayt, metin görselin üzerinde.** Müşterinin açık isteği:
   *"Metinlerin görsellerin üzerine yazılmasını istiyoruz."* Her slaytta üst
   etiket, H1, alt başlık, birincil/ikincil buton var. Orman videosu açılışta
   kalıyor, slaytlar sonrasında geliyor.
2. **Değer önerisi şeridi** — 3 sütun
3. **"Neden Doğa Temelli Gelişim?"** — kaynaklı 4 istatistik kutusu
   (Deloitte %59 · %88 · Gallup %76 · Korn Ferry %58)
4. **"Kök Sal · Sorumluluk Al · Birlikte Yeşer"** — 3 aşamalı marka metodolojisi
5. **5 eğitim programı vitrini**
6. **Doğadan Deneyimsel Öğrenme Atölyeleri** — 4 vitrin kartı

### Eğitim programları — her biri aynı iskeleti taşıyor

```
Açılış Sahnesi          hikâye ile giriş
Doğadan Öğrendiğimiz Ders
Bu Eğitimle Güçlenen Kaslar     4 madde
İş Hayatına Yansıması
Dolaylı Sosyal Hayata Yansıması
Program Bilgileri       format · süre · hedef kitle · hedef yetkinlikler
```

Beş program: Duygusal Dayanıklılık · İletişim Dili · Takım Ruhu ·
Yaratıcı Düşünme · Değişimin Doğası ve Liderlik.

### Görseller

```
Seçilmiş Olanlar     24 dosya  194 MB   ← belgede adı geçenler, ASIL KAYNAK
Doğadan Etkinlik     71 dosya  184 MB
Galeri               21 dosya   11 MB
Diğer Görseller     136 dosya  1.3 GB   ← kütüphane, seçmeli kullanılacak
```

"Seçilmiş Olanlar" içindeki dosya adları belgede birebir geçiyor; hangi bölüme
hangi görselin geleceği belli. **Tanesi ~8 MB, web için ~200 KB'a inmeli.**
Boyutlandırma + WebP dönüşümü zorunlu, aksi hâlde sayfa açılmaz.

---

## Kararlar ve gerekçeleri

**Hazır içerik yönetim sistemi kullanılmıyor.** Sanity ve Payload değerlendirildi, ikisi de elendi. Müşteri kendi alan adında, kendi kullanıcılarıyla açılan bir panel istiyor; dışarıdaki bir servise yönlendirilmek istemiyor. Ayrıca geliştirici Supabase ile kurulu panel deneyimine sahip, yeni bir çatı öğrenmek hız kazandırmaz.

**Kimlik doğrulama elle yazılmıyor.** Supabase'in hazır ve test edilmiş kimlik doğrulaması kullanılıyor. Panel bize ait, güvenlik kodu bize ait değil.

**Statik üreteç bırakılıyor.** Mevcut saf Node üreteci teknik olarak yeterliydi ama geliştiricinin akıcı olduğu yer Next.js. Bilinmeyen bir kod tabanında ilerlemek, teoride daha hafif olan yapıdan daha yavaş.

**Depo geliştiricide kalıyor.** Teslimde müşteriye bir kopyası veriliyor; teklifte "ödemenin tamamlanmasıyla site ve tüm dosyalar size aittir" taahhüdü zaten var.

**Vercel hesabı Afloday adına açılıyor.** Ücretsiz katman kişisel kullanım için tanımlı; kurumsal site bu tanıma girmiyor. Proje geliştiricinin hesabında dururken bir yaptırım gelirse aynı hesaptaki diğer projeler de etkilenir. Afloday'in hesabında olursa, yükseltme gerekirse faturayı onlar öder ve geliştirici aradan çıkar.

---

## Kritik teknik not: iki farklı render yöntemi

Aynı uygulamada iki yaklaşım bir arada kullanılıyor, karıştırılırsa geç fark edilir:

```
/admin/*   →  tarayıcı tarafında veri çekme, giriş arkasında
site       →  sunucuda üretilen sayfa, Google hazır HTML görüyor
```

Halka açık sayfalar tarayıcı tarafında veri çekerse Google boş bir kabuk görür ve sıralama çöker. Müşterinin bir numaralı endişesi tam olarak budur.

---

## Teslim sonrası geliştirici devrede olmayacak

Aylık bakım alınmazsa bu projeye kimse bakmayacak. Kırılabilecek yerler ve bugünden alınan önlemler:

**Supabase ücretsiz katmanda uykuya dalar.** Proje bir hafta hareketsiz kalırsa duraklatılıyor; sonraki derleme patlar ve arıza ancak biri içerik yayınlamaya çalıştığında görünür.
→ Günde bir kez veritabanına dokunan zamanlanmış görev kurulur. Müşteriye "haftada bir giriş yapın" gibi bir görev verilmez; unutulur.

**Bağımlılık güncellemesi derlemeyi bozar.**
→ Sürümler sabitlenir, kilit dosyası depoya girer.

**İçerik girişi sayfayı bozar.**
→ Alanlarda zorunluluk ve karakter sınırı tanımlanır.

**Görsel yanlış oranda yüklenir.**
→ Hedef oran tanımlı, kırpma otomatik.

**Yetkili kişi işten ayrılır.**
→ Vercel ve Supabase hesapları kurumsal e-postaya bağlanır, en az iki yetkili tanımlanır.

---

## İş sırası

Next.js taşıması bitti; bundan sonrası içerik ve yeni bölümler. Sıra bozulmamalı,
her adım kendi başına çalışan bir çıktı bırakıyor.

### Adım 1 — İçeriği veriye dök *(temel iş)*

`docx` içeriği `_build/data.mjs`'e yapılandırılıyor. Yeni veri kümeleri:

```
heroSlaytlari        3 slayt · eyebrow, h1, alt başlık, butonlar, görsel
degerOnerisi         3 sütun
istatistikler        4 kutu · rakam, açıklama, kaynak
metodoloji           3 aşama · Kök Sal / Sorumluluk Al / Birlikte Yeşer
egitimler            5 program · tam iskelet (açılış sahnesi → program bilgileri)
etkinlikKategorileri Sürdürülebilirlik, İç iletişim, Mevsim, Özel gün,
                     Gönüllülük, Ürün lansmanı
hakkimizdaYeni       hikâye, vizyon, misyon, "Neden Doğa?"
sosyalSorumlulukYeni istatistik, hizmetler, çalışma modeli, "Bizi farklı kılan"
```

**Kural:** Metin belgede ne yazıyorsa o. Kısaltma, yeniden yazma, ekleme yok.

**Bitti ölçütü:** Belgedeki her başlık verinin içinde karşılığını buluyor.

### Adım 2 — Görselleri işle

24 "Seçilmiş" görsel + belgede adı geçenler. Her biri için:
en fazla 1920px genişlik, WebP + JPG yedeği, ~200 KB hedef.

**Bitti ölçütü:** Toplam görsel yükü 5 MB'ın altında, hiçbiri 300 KB'ı geçmiyor.

### Adım 3 — Sayfa haritasını 16'ya indir

İptal edilen 19 adres siliniyor, `vercel.json`'a kalıcı yönlendirmeleri giriyor.
Yeni "Doğadan Etkinlik Atölye Deneyimleri" sayfası ekleniyor.

**Bitti ölçütü:** Kalan 16 adres 200, iptal edilen 19 adres 301 dönüyor ve
hedefleri doğru.

### Adım 4 — Yeni anasayfa bölümleri

Değer önerisi şeridi, istatistik kutuları, metodoloji, eğitim vitrini,
atölye vitrini. Mevcut tasarım dili korunuyor.

### Adım 5 — İç sayfalar

`/doga-temelli-egitimlerimiz` (5 program), `/sosyal-sorumluluk-is-danismanligi`,
`/hakkimizda`, `/gelecegi-tasarla`, yeni etkinlik sayfası.

### Adım 6 — Hero slaydı

3 slayt, **metin görselin üzerinde** — müşterinin açık isteği. Orman videosu
açılışta kalıyor. WebGL geçiş sürümü bu adımda değerlendiriliyor *(Faz 1b)*.

### Adım 7 — Formlar, KVKK, yayın hazırlığı

Formların gerçek gönderime bağlanması, KVKK sayfaları *(metin Afloday'den)*,
DNS adımları.

### Faz 1b — Anasayfa slaydı: WebGL sürümü

Geliştirici 21st.dev'den bir bileşen seçti: merkezden büyüyen daireyle açılan,
cam kırılması efektli geçiş. Bileşen olduğu gibi alınmıyor, **uyarlanıyor.**

| Sorun | Ne yapılacak |
|---|---|
| Three.js + GSAP CDN'den (~650 KB) | npm'den seçmeli (~200 KB), `dynamic` + `ssr:false`, yalnızca slayt görününce |
| Tam ekran | Hero bandına sınırlanacak |
| Siyah + altın + Cormorant | Afloday paleti, Newsreader + Jost |
| Demo görselleri | Belgede seçilmiş gerçek görseller |
| 5 efektin 4'ü boş | Yalnızca `glass` tutulacak |
| Erişilebilirlik yok | Duraklat, klavye, azaltılmış hareket |
| Render hiç durmuyor | Görünmezken ve sekme arkadayken duracak |

**Geri düşüş:** WebGL yoksa ya da azaltılmış hareket açıksa bugünkü CSS daire
açılımı devreye giriyor. İkisi aynı işaretlemeyi kullanıyor.

### Sonraki aşama — panel ve blog

Supabase kurulumu, `/admin` paneli, blog. Teklifin 2. aşaması, üç haftalık süre
site yayına alındığı gün başlıyor.

---

## DNS geçişi — e-postayı kesmeden

### Durum tespiti

Alan adı sunucuları `ns3/ns4.byserver.net`. DNS, ByServer tarafında yönetiliyor. Alan adının kayıt firmasına ihtiyaç yok.

Mevcut kayıtlar:

```
afloday.com      A       5.253.141.186     site
www              A       5.253.141.186     site
mail             A       5.253.141.186     e-posta sunucusu
webmail          A       5.253.141.186     tarayıcıdan e-posta
ftp              A       5.253.141.186     dosya erişimi
cpanel           A       5.253.141.186     panel
autodiscover     A       5.253.141.186     Outlook otomatik kurulum
autoconfig       A       5.253.141.186     Thunderbird otomatik kurulum
MX                       afloday.com       e-postanın gideceği yer
TXT (SPF)  v=spf1 include:_spf2.trwww.com include:_spf.trwww.com -all
```

**SPF kaydı var ve düzgün yapılandırılmış** (`-all` ile bitiyor). Taşımada
dokunulmayacak.

**Tehlike:** MX kaydı `afloday.com`'un kendisini gösteriyor. Sitenin A kaydı değiştirildiği an e-posta da yeni sunucuya gitmeye çalışır ve tamamen kesilir.

### Panel erişimi

```
https://cpanel.afloday.com/     doğrudan giriş ekranı
https://5.253.141.186:2083      alternatif kapı
```

`cpanel.afloday.com` kendi A kaydına sahip olduğu için **taşınmadan sonra da çalışmaya devam eder.** `afloday.com/cpanel` ise çalışmayı bırakır.

Giriş bilgileri Afloday'de. Not: `byserver.net` bomboş bir sayfa döndürüyor, ulaşılabilir bir müşteri paneli veya destek kanalı bulunamadı. Şifreler bulunamazsa iş büyür; bu ihtimal erken sorulmalı.

### Uygulama

**Başlamadan önce:** Bütün DNS listesinin ekran görüntüsü alınır.

**Aşama 1 — yayından 2 gün önce**

| Tip | Kayıt | Eski | Yeni |
|---|---|---|---|
| MX | afloday.com | `afloday.com` | `mail.afloday.com` |

Bu değişiklik işlevsel olarak hiçbir şeyi değiştirmiyor, çünkü ikisi de aynı sunucuya çıkıyor. Sadece e-postayı sitenin A kaydından koparıyor.

**Doğrulama:** Dışarıdan `info@afloday.com`'a mail atılır, o adresten dışarıya mail gönderilir, webmail'e girilir. Üçü de çalışmadan devam edilmez.

**Aşama 2 — yayın günü**

| Tip | Kayıt | Eski | Yeni |
|---|---|---|---|
| A | afloday.com | `5.253.141.186` | Vercel'in verdiği IP |
| CNAME | www | `5.253.141.186` | Vercel'in verdiği adres |

Değerler Vercel ekranından kopyalanır, ezberden yazılmaz.

**Dokunulmayacaklar:** `mail`, `webmail`, `ftp`, `cpanel`, `autodiscover`, `autoconfig` ve alan adı sunucuları.

**Nameserver taşınmaz.** Vercel'e nameserver devretmek, yukarıdaki 8 kaydın tamamını elle yeniden oluşturmayı gerektirir; biri atlanırsa e-posta ya da panel erişimi ölür. Kazancı yok, riski yüksek.

**Doğrulama:** `nslookup afloday.com` yeni IP'yi gösteriyor, güvenlik sertifikası Vercel tarafından otomatik alınıyor, e-posta testleri tekrarlanıyor.

**Geri alma:** A kaydı `5.253.141.186`'ya geri yazılır. Eski Joomla sitesi hiç silinmediği için dakikalar içinde geri gelir.

---

## Fiyat — anlaşılan koşullar

4 Ağustos 2026'da mutabık kalındı. Önceki 30.000'lik teklif geçersiz.

```
Toplam                     20.000 TL (KDV dahil)
                           site + blog + yönetici paneli, tek paket
Fatura                     tek fatura, site yayına alındığında
Bakım · ilk 3 ay           dahil
Bakım · sonrası            isteğe bağlı, taahhüt yok
                           3. ayın sonunda yıllık bedel birlikte belirlenecek
```

**Müşterinin kendi önerisi:** *"İlk 3 ay siz bizim sizi ne kadar meşgul
ettiğimizi görün. Sonrasında birlikte bakım anlaşması için yıllık bir ücret
belirleyelim."* Mevcut sağlayıcılarıyla da böyle çalışıyorlar — yıllık bakım ve
revize bedeli var, ekstra işler için ara ödeme yapıyorlar.

**3. ay görüşmesine hazırlık:** Site ilk günden hata izleme sistemine bağlanacak.
Üç ayın sonunda "yılda 2-3 çağrı" tahmini yerine gerçek veriyle konuşulacak:
kaç hata yakalandı, kaçı kullanıcıya yansımadan düzeltildi.

**Fatura düzeni:** Kendi şirketi olmadığı için fatura bir yakının ortağının şahıs
şirketinden kesilecek. Ödeme faturayı kesen hesaba gitmeli. Fatura teslimden
sonraki 7 gün içinde kesilir, tahsilat beklenmez. Vergi payı işten önce yazılı
olarak netleştirilmeli.

---

## Altyapı sahipliği — dikkat edilecek nokta

Mevcut sitenin altyapısı, **yerine geçilen ajansın kontrolünde:**

```
byflash.com          mevcut siteyi yapan ajans (site altbilgisinde yazıyor)
byserver.net         aynı ekibin barındırma kolu · kurumsal sayfası boş
5.253.141.186        site + e-posta + ns3 + ns4 + ajansın diğer müşterileri
                     hepsi TEK makinede
```

Yani cPanel, DNS ve nameserver'ların tamamı ByFlash/ByServer'da. Erişim talebi
oradan geçecekse süreç geliştiricinin hızına değil, işini kaybeden bir ajansın
iş birliğine bağlı kalır.

**Bu yüzden erken sorulacaklar:**
1. cPanel giriş bilgileri Afloday'de mi, ajansta mı?
2. Alan adı kimin adına kayıtlı — Afloday mı, ajans mı?

İkincisi kritik: alan adı ajans adına kayıtlıysa nameserver değiştirme yetkisi
bile onlarda olur.

---

## Afloday'den beklenen cevaplar

**Acil — işi bloke ediyor**

1. **cPanel giriş bilgileri** — sayaç bunun geldiği gün başlıyor. *(Hasan Basri Ünlü)*
2. **Alan adı kayıt firması ve hesap kimde** — nameserver yetkisi için.

**İçerik kararları**

3. İptal edilen 17 atölye sayfasından **hangi 7'si** Etkinlik olarak kalacak?
4. `/katilim` Excel'de İPTAL işaretli ama sitede kurulu — gerçekten kalkacak mı?
5. Metni değişecek 6 sayfanın yeni metinleri ne zaman gelir?
6. `/atolye-takvimi`, `/atolye-workshop`, `/butik-cicekcilik` canlıda 200 dönüyor
   ama Excel'de hiç yok. Ne olacaklar?
7. Blogda kaç yazıyla başlanacak, kategori ayrımı olacak mı?
8. KVKK aydınlatma metni ve çerez politikası metinleri (hukukçularından).
9. Panele ilk girecek kişinin e-posta adresi.
