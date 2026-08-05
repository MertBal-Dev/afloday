# Devam planı

> **Bu dosya her iş bitiminde güncellenir.** Yeni oturumun tek görevi:
> `CLAUDE.md` + bu dosyayı okuyup kaldığı yerden devam etmek.
>
> Son güncelleme: **5 Ağustos 2026, akşam**

---

## Şu an neredeyiz

**Ceylan hanımın geri bildirimi geldi (5 Ağustos akşamı), uygulanıyor.**
Blog ve `/admin` paneline henüz başlanmadı.

```
Faz 1 · Site         ✅ bitti
Faz 1b· Geri bildirim ⏳ yapı ve ölçek bitti, renk + 3 karar bekliyor  ← BURADASIN
Faz 2 · Blog + panel ⬜ başlanmadı
Yayın · DNS geçişi   ⛔ cPanel erişimi bekleniyor
```

### Geri bildirimde yapılanlar

| Ceylan hanımın sözü | Ne yapıldı |
|---|---|
| "atölyeler çok yazı yazı kalmış, görseller altta word düzeni gibi" | Etkinlik sayfası ikiye ayrıldı: 7 kategori kartlı genel bakış + 7 ayrı kategori sayfası. Akordeon kalktı. |
| "hepsini bir arada görebilir, tıklayınca içine girebiliriz" | `kat-izgara` — 7 kart tek ekranda, tıklayınca `etkinlik-<id>` sayfası |
| "aralara görseller girebilir, üzerinde olabilir yazılar" | Kategori kapağı tam genişlik, ad fotoğrafın üzerinde. Gövde mozaik: atölye kartı ve fotoğraf eşit hücreler. |
| "çok büyük büyük geldi" + "yazılar büyüyebilir, orantılı olmaları en doğrusu" | Başlık 120→68px, gövde 15→17/18px. Oran **8:1 → 3.9:1** |
| "sayfalarda boşluklar da çok" | Bölüm dolgusu 108→78px |
| "açılan ana menüde başlıklar çok büyük" | Drawer bağlantısı 31→20px (telefon) |
| "10 atölye, 7 kişi ekip vs olmasın" | 4 sayaç rozeti kaldırıldı |
| "başlıklardan sonra nokta olmasın" | 10 başlıktan nokta kaldırıldı |
| "referans logoları en az iki katı büyüsün" | 32→64px, hücre ölçüsü buna göre |

Kanıt: `verify.mjs` 0 sorun · `a11y.mjs` 0 bulgu · 34/34 adres · 5 ekran ×
26 sayfa = 130 kontrolde yatay taşma yok.

### Panel şeridi — "hepsi bir arada derli toplu"

Ceylan hanım naregitim.com/cozumlerimiz'i gösterdikten sonra WhatsApp'ta
netleştirdi: *"Büyüklük olarak değil şekil olarak demek istedim. Hepsi bir
arada derli toplu."*

Referansın şekli Playwright ile ölçüldü: 6 dikey panel uç uca, aralarında
boşluk yok, yalnız saç teli çizgi; etiketler dikey; panele gelince arka
plandaki illüstrasyonun tamamı değişiyor; sayfa 2.9 ekran. Telefonda 2×3
ızgaraya dönüyor, illüstrasyon hücreler boyunca devam ediyor.

Bizde uygulanan hâli `_build/panel-serit.mjs`: 7 etkinlik kategorisi ve 5
eğitim programı artık boşluklu kart ızgarası değil, uç uca panel şeridi.
Referansın sihri el yapımı suluboyalarda; bizde fotoğraf var, o yüzden
arka plan değişimi yerine panelin kendi fotoğrafı duruyor ve üzerine
gelince doygunluk/parlaklık açılıyor.

### Fotoğraf-atölye eşlemesi — Ceylan hanıma sorulacak

Kategori sayfalarında fotoğraflar atölye kartlarının YANINDA değil,
onlarla aynı ızgarada eşit hücre olarak duruyor. Sebep: dosya adları
hangi fotoğrafın hangi ATÖLYEYE ait olduğunu söylemiyor, yalnız
kategoriyi söylüyor. "Bonsai Atölyesi" başlığının yanına rastgele kare
koymak o karenin o atölyeden olduğunu iddia etmek olurdu.

**Ceylan hanım hangi karenin hangi atölye olduğunu söylerse** eşleme
`etkinlik-gorselleri.mjs` içinde tek satırla yapılır ve her atölye kendi
fotoğrafıyla görünür.

---

## Yeni bilgisayarda ilk adımlar

```bash
git clone https://github.com/MertBal-Dev/afloday.git
cd afloday
npm install
```

**`.env` dosyasını elle oluştur** (depoda yok, `.env.example`'ı kopyala):

```
SITE_URL=https://afloday.vercel.app
PREVIEW=1
```

`PREVIEW=1` iken sayfalara `noindex` ve `robots.txt` `Disallow` konuyor.
Gerçek yayına geçerken bu satır silinecek. Vercel tarafındaki değişkenler
zaten ayarlı, dokunma.

Sonra doğrula:

```bash
node _build/build.mjs && node _build/verify.mjs   # 0 sorun vermeli
npm run build                                     # üretim derlemesi geçmeli
```

---

## Afloday'den bekleyenler (iş bunlara bağlı)

| # | Ne | Neyi açar | Durum |
|---|---|---|---|
| 1 | **cPanel / DNS erişimi** | Yayın, teslim sayacı | istendi, beklemede |
| 2 | **KVKK aydınlatma + çerez metni** | Formların gerçek gönderime bağlanması | istendi, beklemede |
| 3 | `info@afloday.com` SMTP bilgileri | Form bildirim e-postası | cPanel ile gelecek |
| 4 | Vitrin kartı ③ ve ④ metinleri | Anasayfada 2 kart daha | sorulacak |
| 5 | %88 istatistiğinin kaynağı | Kaynak satırı | sorulacak |

4 ve 5 geri bildirim turunda sorulacak, aciliyeti yok.

---

## Sıradaki iş — Faz 2: blog + `/admin` paneli

Taahhüt: **en geç 3 hafta.** Hiç başlanmadı, asıl kalan iş bu.

### Kararlaştırılan yaklaşım

**Supabase + kendi mail sunucuları.** Gerekçesi:

- Faz 2'de zaten kurulacak, formlar da oraya bağlanınca tek hesap tek yer
- Hesap Afloday'in olur, geliştiriciye bağlı hiçbir şey kalmaz (temiz devir)
- CV dosyası Storage'da düzgün durur (4 MB, imzalı bağlantı)
- **Frankfurt (eu-central-1)** bölgesi seçilecek — KVKK için veri AB'de kalır
- Bildirim e-postası `info@afloday.com` SMTP'siyle gider, üçüncü servis yok

**Google Apps Script elendi:** script geliştiricinin kişisel Google hesabında
çalışır, teslim sonrası gizli bağımlılık ve destek yükü olur. Hesap kapanırsa
form sessizce ölür.

### Mimari kararı (Faz 2 başında verilecek)

**A · Statik kalmak.** Blog yazıları derleme anında Supabase'den çekilir, yeni
yazı webhook ile Vercel'de yeniden derleme tetikler. Panel tarayıcıda çalışan
React, Supabase'e doğrudan bağlanır, yetki Row Level Security ile. Bugünkü
yapı aynen devam eder.

**B · Sunucu tarafına geçmek.** `output: 'export'` kalkar, Next sunucu
bileşenleri devreye girer. Blog anında yayınlanır.

Kullanıcı A'ya yakın duruyor: "yazı ekleyip 40 saniye sonra yayında olması
kurumsal bir blog için sorun değil, karşılığında altyapı basit ve ucuz kalıyor."

### Faz 2 adımları

1. Supabase projesi (Frankfurt), tablo + storage kovası + RLS kuralları
2. Formları bağla: `iletisim` ve `ik` (CV yüklemesi dahil)
3. `data-demo` özniteliğini kaldır, "Bu bir tasarım sunumudur" notunu sil
4. KVKK metni gelince `_build/kvkk.mjs` içinde `hazir: true` yap
5. Blog: liste + yazı sayfası, adres yapısı `/blog/<slug>`
6. `/admin`: giriş, yazı ekle/düzenle, form mesajlarını görüntüle
7. Bildirim e-postası (SMTP)

---

## Açık tasarım kararları

**Anasayfa hero başlığı.** Şu an *"Doğada öğrenilen, elde kalan bir gün."* —
bu cümle **hiçbir kaynakta yok, geliştirici yazdı.** Ceylan hanıma açıkça
bildirildi, kendi cümlesini söylerse değişecek. Kaynaklı alternatif:
*"Çiçeklerin, doğanın iyileştirici etkisini eğitimle, atölyeyle, özgün
tasarımlarla iş ve yaşam alanlarına taşıyoruz."* (afloday.com'un kendi cümlesi)

**Footer imzası.** Alt şeritteki sağ yuva boş; eskiden ByFlash Agency imzası
oradaydı. Geliştirici imzası eklenecekse yeri orası. Karar: teslim sırasında
Ceylan hanıma sorulacak, sormadan konmayacak. Corentia markası
kullanılmayacak, kişisel isim tercih edilecek.

**İstatistik arka planı.** Belge satır 54 "yaprak/toprak deseni" diyor ama
satır 55'te iş insanı elleri fotoğrafı veriyor; belge kendi içinde çelişiyor.
Şu an tarife uyan üretilmiş doku kullanılıyor
(`site/assets/img/rev2/secilmis/dogal-zemin-dokusu.*`). Belgenin kendi
görseli de duruyor, istenirse tek satırla geri dönülür. Kaynak PNG ve işleme
adımları: `docs/gorsel/BENİOKU.md`.

---

## Bitirilmiş işler (kanıtlarıyla)

| İş | Kanıt |
|---|---|
| Belge doğrulaması | `docs/belge-kapsam-raporu.md` — 8 bölüm, 380 satır, karşılıksız 0 |
| Gece denetimi | `docs/gece-denetimi-2026-08-05.md` |
| Karar günlüğü | `docs/afloday-sorular-2026-08-04.md` — 31 madde |
| Mimari gerekçeleri | `docs/mimari.md` |

---

## Güncelleme kuralı

Bir iş bittiğinde **bu dosyayı güncelle**: "Şu an neredeyiz" bölümünü ve
sıradaki adımı. Karar verdiysen `docs/afloday-sorular-2026-08-04.md`'ye madde
ekle. Böylece bir sonraki oturum sadece iki dosya okuyup devam eder.
