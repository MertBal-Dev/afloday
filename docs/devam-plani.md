# Devam planı

> Son güncelleme: **6 Ağustos 2026**
>
> **Dal:** `feedback-2026-08-06` · `main` hâlâ `4b9ea9c` (yayındaki hâl)

---

## Şu an neredeyiz

Ceylan Kalyon Özdemir'in 5 Ağustos geri bildirimi uygulandı ve doğrulandı.
Push edilmedi, onay bekliyor.

```
Faz 1  · Site               ✅ bitti
Faz 1b · Geri bildirim      ✅ uygulandı, gönderilmeyi bekliyor  ← BURADASIN
Faz 2  · Blog + /admin      ⬜ başlanmadı
Yayın  · DNS geçişi         ⛔ cPanel erişimi bekleniyor
```

### Geri bildirimin 14 maddesi

| Ceylan hanımın sözü | Sonuç |
|---|---|
| "çok büyük büyük geldi" | başlık 120 → 68px |
| "yazılar büyüyebilir, orantılı olsun" | gövde 14-15 → 17/18px · oran 8:1 → 3.9:1 |
| "sayfalarda boşluklar da çok" | bölüm 108 → 78px · alt bilgi 1071 → 862px |
| "10 atölye, 7 kişi ekip vs olmasın" | 5 sayaç kaldırıldı, 0 kaldı |
| "başlıklardan sonra nokta olmasın" | 10 başlık + alt bilgi (31 sayfa) + hero |
| "eski logo rengi var, turuncu yeşil" | karmen ve bronz 0 öğede kaldı |
| "açılan menüde başlıklar çok büyük" | telefonda 31 → 20px |
| "5 eğitimi sayfaya sığdırsak" | 11.7 → 3.9 ekran + 5 program sayfası |
| "atölyeler yazı yazı, görseller word düzeni" | panel şeridi + 7 kategori sayfası, mozaik gövde |
| "hepsi bir arada derli toplu" | uç uca panel şeridi, tek arka plan, saç teli çizgi |
| "vizyon misyon alt alta, sevmedim" | yan yana, yazı fotoğrafın üzerinde |
| "resim yazı resim yazı, daha dinamik" | mozaik editoryal ölçeğe geçti (hücre 420 → 637px) |
| "referans logoları iki katı" | 32 → 64px |
| "galeri sayfasını kapatabiliriz" | kapatıldı, /galeri 301 ile etkinliklere |

### Doğrulama

```
verify.mjs        0 sorun · 31 sayfa · 495 görsel · 1647 bağlantı
a11y.mjs          0 bulgu
kontrast          0 gerçek ihlal
canlı adres       34/34
responsive        5 ekran × 30 sayfa = 150 kontrol, yatay taşma yok
320px reflow      0/9 sayfada taşma (WCAG 1.4.10)
görsel kırpma     kapak %89 → %36 · şerit %91 → yapısal olarak çözüldü
```

---

## Sıradaki iş

1. **Ceylan hanıma gönder.** Onay gelirse `feedback-2026-08-06` → `main`.
2. **Faz 2: blog + /admin paneli.** Taahhüt en geç 3 hafta, hiç başlanmadı.
   Kararlaştırılan yaklaşım: Supabase (Frankfurt) + Afloday'in kendi SMTP'si.
   Hesap Afloday'in olur, geliştiriciye bağlı bağımlılık kalmaz.
3. **DNS geçişi** — cPanel erişimi gelince. MX kaydı kritik, `CLAUDE.md`'ye bak.

---

## Afloday'den bekleyenler

| # | Ne | Neyi açar | Durum |
|---|---|---|---|
| 1 | cPanel / DNS erişimi | Yayın, teslim sayacı | beklemede |
| 2 | KVKK aydınlatma + çerez metni | Formların gerçek gönderime bağlanması | **müşterinin sorumluluğu** |
| 3 | `info@afloday.com` SMTP | Form bildirim e-postası | cPanel ile gelecek |
| 4 | Vitrin kartı ③ ve ④ metinleri | Anasayfada 2 kart daha | sorulacak |
| 5 | %88 istatistiğinin kaynağı | Kaynak satırı | sorulacak |
| 6 | **Hangi fotoğraf hangi atölye** | Her atölye kartı kendi karesiyle | sorulacak |

6. madde önemli: dosya adları yalnız kategoriyi söylüyor. Eşleme gelirse
mozaikteki fotoğraf karoları atölye kartlarıyla birleştirilebilir.

---

## Karar verilmiş, uygulanmamış

**Turuncu düzlem.** Araştırma, tam genişlikte bir turuncu bandın koyu
metinle 5.11:1 verdiğini ve kurucunun "turuncu marka rengimiz"
beklentisini karşıladığını söylüyor. Kullanıcı turuncuyu iki kez
reddettiği için eklenmedi; istenirse tek bloklu bir bant olarak açılabilir.

**Anasayfa.** 11.1 ekran. Kartlarda belgeden gelen `vitrinMetin`,
etiketler ve künye var; panel şeridine çevirmek kaynaklı içerik siler.
Ceylan hanımın anasayfa hakkında yorumu gelene kadar dokunulmuyor.

**Geleceği Tasarla element haritası.** Belge "4 küçük ikonla gösterilir"
diyor. Ceylan hanım bu sayfa hakkında yorum yapmadı, o yüzden belge
geçerli. Yorum gelirse geri bildirim öncelikli — bkz. hafıza notu.
