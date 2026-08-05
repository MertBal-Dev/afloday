# Devam planı

> **Bu dosya her iş bitiminde güncellenir.** Yeni oturumun tek görevi:
> `CLAUDE.md` + bu dosyayı okuyup kaldığı yerden devam etmek.
>
> Son güncelleme: **5 Ağustos 2026, akşam**

---

## Şu an neredeyiz

**Site bitti ve yayında.** `afloday.vercel.app` — Ceylan hanıma gönderildi,
geri bildirim bekleniyor. Blog ve `/admin` paneline henüz başlanmadı.

```
Faz 1 · Site         ✅ bitti, müşteri incelemesinde
Faz 2 · Blog + panel ⬜ başlanmadı  ← SIRADAKİ İŞ
Yayın · DNS geçişi   ⛔ cPanel erişimi bekleniyor
```

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
