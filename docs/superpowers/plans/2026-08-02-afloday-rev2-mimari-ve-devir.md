# Afloday Rev. 2 — Mimari, Yayın ve Devir Planı

**Hedef:** Siteyi Next.js'e taşıyıp blog ve yönetici paneli eklemek, orijinal adresleri birebir koruyarak yayına almak, e-posta hizmetini kesintiye uğratmadan geçişi tamamlamak.

**Mimari:** Tek bir Next.js uygulaması. Halka açık sayfalar sunucuda üretiliyor (SEO için zorunlu), `/admin` altındaki panel giriş arkasında çalışıyor. Veri, kimlik doğrulama ve dosya depolama Supabase'de. Barındırma Vercel'de, Afloday'in kendi hesabında.

**Teknoloji:** Next.js · Supabase · Vercel

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

## Fazlar

Sıra bozulmamalı. Her faz kendi başına çalışan bir çıktı bırakır.

### Faz 0 — Hesaplar

Afloday'in e-postasıyla Vercel ve Supabase hesapları açılır, geliştirici ekip üyesi olarak eklenir. cPanel giriş bilgileri Afloday'den alınır.

### Faz 1 — Next.js iskeleti ve tasarımın taşınması

Next.js kurulur, `afloday.css` olduğu gibi içeri alınır, mevcut şablonlar bileşenlere çevrilir, kalan 19 sayfa üretilir. İçerik bu aşamada hâlâ dosyada.

**Bitti sayılma ölçütü:** 19 sayfa mevcut önizlemeyle görsel olarak aynı, masaüstü ve mobilde taşma yok.

### Faz 2 — Supabase ve panel

Veri modeli kurulur, giriş sistemi bağlanır, `/admin` altında sayfa metinleri, ekip üyeleri ve görseller düzenlenebilir hâle getirilir. Görsel yükleme ve kırpma bu fazda.

**Bitti sayılma ölçütü:** Panelden bir metin ve bir görsel değiştirildiğinde site güncelleniyor.

### Faz 3 — Blog

Blog liste ve yazı sayfaları, zengin metin editörü, LinkedIn paylaşım düğmesi, seçilmiş LinkedIn gönderilerinin sitede gösterimi.

### Faz 4 — Adres eşleme

Kalan 17 adres orijinal siteyle birebir eşlenir. `/dogadan-gelisim-atolyeleri` ve `/sosyal-sorumluluk-is-danismanligi` şu an tek sayfada birleşik, adreslerini korumak için ikiye ayrılır. Silinen 17 adres için kalıcı yönlendirme kurulur; her biri konusuna en yakın sayfaya gider, anasayfaya toplu yönlendirme yapılmaz.

**Bitti sayılma ölçütü:** `afloday.vercel.app` üzerinde kalan 17 adres 200, silinen 17 adres 301 dönüyor ve hedefleri doğru.

### Faz 5 — Yayın

Aşağıdaki DNS bölümü uygulanır.

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
```

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

## Fiyat

```
Site (yeni site haritasına göre)          12.500 TL
Blog + Yönetici Paneli                    28.000 TL
──────────────────────────────────────────────────
Toplam                                    40.500 TL

Aylık bakım                                1.500 TL / ay
```

Panelli sistemde güvenlik güncellemeleri ihmal edilemez; bakım artık isteğe bağlı bir ek değil, sistemin gereği. Satış argümanı bu.

---

## Müşteriden beklenen cevaplar

Görev düzeyinde uygulama planı bunlar netleşince yazılacak.

1. `/butik-cicekcilik` ve `/atolye-workshop` şu an yayında ama site haritasında yok. Kaldırılacak mı?
2. 16 atölye sayfası silinince o metinler nereye gidecek?
3. "Doğadan Gelişim Atölyeleri" satırının durumu Excel'de boş.
4. Sürdürülebilirlik sayfası listede yok.
5. Blogda kaç yazıyla başlanacak, kategori ayrımı olacak mı?
6. cPanel giriş bilgileri kimde?
