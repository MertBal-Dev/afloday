# Devam planı

> Son güncelleme: **6 Ağustos 2026**
>
> **Dal:** `main` = `6ad03b8`, yayında · `feedback-2026-08-06` = `db86d30`,
> yedek · geri dönüş etiketi `yayin-oncesi-2026-08-06` = `4b9ea9c`

---

## Şu an neredeyiz

Ceylan Kalyon Özdemir'in 5 Ağustos geri bildirimi uygulandı, doğrulandı,
`main`'e alındı ve yayına çıktı. **Ceylan hanıma henüz haber verilmedi.**

```
Faz 1  · Site               ✅ bitti
Faz 1b · Geri bildirim      ✅ yayında, haber verilmeyi bekliyor  ← BURADASIN
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

## 6 Ağustos oturumu — nerede kaldık

Oturum IDE yeniden başlatılmak üzere durduruldu. Kaldığımız nokta:

### Bu oturumda yapıldı

- Devir doğrulaması: `build` + `verify` (31 sayfa · 495 görsel · 1647 bağlantı,
  0 sorun) + `a11y` (0 bulgu) + `erisim` (0 erişilemeyen) + `seo` (0 bulgu,
  `npm run build` sonrası) + `npm run build` (35 sayfa export).
- **13 denetim betiğindeki eski makine yolları düzeltildi.** Hepsinde
  `c:/Users/Gaming/Desktop/Afloday/` gömülüydü, bu makinede `ENOENT` veriyordu.
  Artık kök `import.meta.url`'den çözülüyor, raporlar `_audit/rapor/`'a gidiyor.
- `playwright-core` devDependency olarak eklendi (Chrome `channel: 'chrome'`
  ile kullanılıyor, tarayıcı indirmeye gerek yok).
- **Yeni betik `_audit/denetim/mobil.mjs`** — satır başına karakter (CPL) ve
  hesaplanmış kontrast ölçüyor. `node _audit/denetim/mobil.mjs 390`.
- Eskimiş "main geri bildirim öncesi hâlde" bilgisi CLAUDE.md ve bu dosyadan
  temizlendi. `main` = `6ad03b8`, yayında.
- **Ceylan hanımın geri bildiriminin aslı depoya alındı:**
  `docs/kaynak/geri-bildirim-2026-08-05.md`. 14 maddelik özette olmayan
  maddeler orada işaretli.

### Ölçülen sorunlar

| Bulgu | Ölçüm |
|---|---|
| Mobilde dar sütun | 390px'te 13 sayfada 49 blok, satır başına <26 karakter. En kötüsü `p.body` 113px, `a.btn` 137px, `span.pserit-ad` 163px. Rahat okuma 45-75. |
| Panel şeridi mobilde | 390px'te iki sütun, başlıklar 3 satıra kırılıyor, "Eğitimi" ok düğmesine biniyor, son satırda boş hücre. |
| Fotoğraf üstü metin | "Yaratıcı Düşünme" kartında krem yazı parlak fotoğrafta okunmuyor, karartma katmanı yok. |
| **13 sayfa geri bildirimden nasibini almamış** | `git diff 4b9ea9c..6ad03b8` ile ölçüldü. gulumseyen-yarinlar-projesi, surdurulebilirlik, sosyal-sorumluluk, ik (15 satır); 7 ekip sayfası + iletisim (17); 404 (13). Hepsi sadece kalıp: önbellek damgası, menüden Galeri çıkışı, `tabindex="-1"`, başlık sonu noktası. Sıfır tasarım işi. |
| **CSS'te üç kuşak ölü palet kodu** | `.btn-primary` 3 kez tanımlı (897 turuncu/beyaz, 3875 turuncu/koyu, 3964 mürekkep/krem — sonuncusu kazanıyor). `--carmine` 3 tanım (şu an turuncu tutuyor), `--bronze` 4 tanım, `.em` 3 tanım. `:root` dışında ~100 ham hex. |

### Kararlaştırıldı

Dört iş, bu sırayla:

| # | İş | Durum |
|---|---|---|
| **0** | Renk token katmanı toparlama | **sırada** |
| 1 | Mobil okunabilirlik (49 blok) | bekliyor |
| 2 | 13 dokunulmamış sayfa + tasarım seviyesi | bekliyor |
| 3 | Ceylan hanımın renk paneli | 0'a bağlı |

**0 numaranın yaklaşımı seçildi: A + C birlikte.** Rol adlı ~12 token
(`--zemin`, `--eylem`, `--vurgu`, `--etiket`, `--odak`, `--bant` …), palet
`_build/palet.mjs` içinde tek kaynak, `:root` oradan üretiliyor. Üç override
bloğu silinecek, karar denemeleri `docs/`'a taşınacak.

**Regresyon ağı: 31 sayfa × 3 genişlik (390 / 768 / 1440) tam sayfa ekran
görüntüsü, refactor öncesi ve sonrası, piksel farkı sıfır olmalı.**

### 7 Ağustos gece turu — yayına alındı

31 sayfa Playwright ile tek tek gezildi (telefon 390 · laptop 1366 ·
masaüstü 1440). Sonuç: **16 PASS, 1 FAIL, 7 sayfa talimatla atlandı.**

FAIL: `sosyal-sorumluluk-is-danismanligi` — 8 metin bloğu arka arkaya,
toplam 3 görsel. Feedback'in "çok yazı yazı" maddesine takılan tek sayfa.

Düzeltilenler:

| Ne | Önce | Sonra |
|---|---|---|
| Panel şeridi telefonda | 7 kategoriden **1'i** görünüyor | 7'si de |
| Proje kapağı | %44 kırpılıyor | %0 |
| Açık zeminde metin kontrastı | **1.93:1** | 5.14:1 |
| Kategori kartı düzeni | bozuk (resim devleşmiş) | 96px + etiket satırı |
| Atölye kartı metin genişliği | 277px | 301px |
| Koruncuk fotoğrafları | 220×220 kare kırpma | 800px, doğal oran |
| Anasayfa fotoğraf yığını | 42 | 4 |
| Telefonda dar metin bloğu | 49 | 0 |
| Kapanış karesi | yetim, yanında boş hücre | tam genişlik, tam boy dosya, srcset |

Dördü benim kendi düzeltmelerimin açtığı yaralardı ve hepsi ancak gözle
bakılarak yakalandı. Ölçüm nereye bakacağını söylüyor, ne olduğunu değil.

**Açık kalan, feedback dışı:** mozaikte kırpma (7 sayfa) ve büyütme
(3 sayfa, `srcset` eksik). Kullanıcı kararıyla bırakıldı.

### Kaldığımız yer

**Tasarım spec'i yazıldı ve onaylandı:**
`docs/superpowers/specs/2026-08-06-premium-tasarim-design.md`
12 ölçülebilir PASS kapısı, 6 aşama.

**Aşama 0 (renk token katmanı) BİTTİ ve doğrulandı.**

| Ne | Önce | Sonra |
|---|---|---|
| Ölü token tanımı | 22 | 0 |
| `:root` dışında ham hex | 87 kullanım | 3 (ikisi `@media print`, kasıtlı) |
| Paletin kaynağı | CSS'e dağılmış 3 kuşak yama | `_build/palet.mjs`, tek yer |
| CSS satır | 4553 | 4229 |

Doğrulama: `gorunum-dondur` 31 sayfa × 9030 öğe, renk + tipografi + kutu
ölçüsü, **0 fark**. verify · a11y · erisim · seo hepsi temiz.

**Görsel yerleşim kararı verildi: editoryal bant.** Dört aday gerçek
fotoğraflarla prototiplendi ve ölçüldü, üçü elendi. Gerekçe spec'in
4.2 bölümünde, prototip görüntüleri `_audit/rapor/kiyas-A|B|C.png`.

### Aşama 1 başladı — iki bulgu planı değiştirdi

**1 · Kırpmasız sistem zaten kısmen yazılmış.** `_build/etkinlik-tasarim.mjs`
içindeki `bant()` fonksiyonu hizalı satır matematiğini yapıyor: bir bandaki
kareler aynı yükseklikte, genişlikler orana göre, `aspect-ratio: Σoran`.
`gorsel-olculeri.mjs` ölçü manifestosu ve CSS'teki `.plate-frame-tall/-sq/-wide`
sınıfları da duruyor. Yani Aşama 1 **sıfırdan yazmak değil, var olanı yaymak**.

Ölçü manifestosu genişletildi: 114 → **170 kayıt**. Eskiden yalnız `rev2/`
taranıyordu, ekip ve proje klasörleri kayıt dışıydı; bant motoru oranını
bilmediği fotoğrafa varsayılan uygulayıp kırpardı.

**2 · Bazı sayfalarda fotoğraf çözünürlüğü yetersiz — tasarımla çözülmez.**
`_audit/denetim/gorsel-kalite.mjs` ile ölçüldü (logolar hariç, onların küçük
olması normal):

| Sayfa | Durum |
|---|---|
| `gulumseyen-yarinlar-projesi` | **13 fotoğrafın 12'si 220×220px.** Editoryal kullanıma uygun değil. |
| `iletisim`, `ik`, `404` | **Hiç fotoğraf yok.** |
| `zeynep-altunhan` 450px · `alara-apaydin-saruhan` 500px | ekip portresi, sınırda |
| `hakkimizda` | 12 fotoğraf, ortanca 618px, 2'si 600 altı |
| Diğer 20 sayfa | ortanca 800-1600px, sorun yok |

**Kaynak var ama bağlı değil:** arşivdeki `Diğer Görseller` klasörü
132 dosya / 1.2 GB ve yapı akışına hiç bağlanmamış (`gorsel-hazirla.mjs`
yalnız `Seçilmiş Olanlar`, `Doğadan Etkinlik…`, `Galeri` okuyor). Aç kalan
sayfalar için ilk bakılacak yer burası.

### Tasarım tezi belirlendi (frontend-design skill)

Skill'in kalibrasyon uyarısı: yapay zekâ üretimi tasarımların en yaygın
kalıbı "krem zemin + yüksek kontrastlı serif + terracotta vurgu". Afloday
tam olarak bunun içinde. Palet bağlayıcı (Ceylan hanımın kararı), o yüzden
ayırt edicilik **yerleşimden ve tek imza öğesinden** gelmek zorunda.

**Tez:** Herbaryumda örnek levhaya sığsın diye kesilmez; levha örneğe uyar.
Kırpmasızlık dekoratif tercih değil, sitenin kendi kavramının mantığı.
İmza bu.

**Bant etiketi kararı:** kategori adı (`ÇOCUK ATÖLYESİ`), sıra numarası
değil. Numara ancak içerik gerçekten bir sıra ise anlamlı; atölyeler eş
düzeyde. Ceylan hanım sayaçlardan da hoşlanmadı.

### Kaldığımız yer

Bant motoru yazılmadı. Prototip için sayfa seçimi gerekiyor:
`gulumseyen-yarinlar-projesi` seçilmişti ama 220px fotoğraflarla tasarım
kararı sağlıklı değerlendirilemez.

### Açık uçlar

- **WeTransfer kaynak klasörü bulunamadı.** Verilen yol
  `C:\Users\Administrator\Downloads\wetransfer_afloday-web-metin-ve-gorseller_2026-08-04_1711\`
  mevcut değil. Doğru yol gerekiyor; "hem son verdikleri hem eski ana plan"
  orada olduğu söylendi.
- **Ceylan hanım satır satır geri bildirim ya da görüşme teklif etmiş**
  ("yarın 11:00'e kadar uygun olacağım", 5 Ağustos tarihli). Yanıtlanmadı.
- Site yayında ama Ceylan hanıma haber verilmedi.
- `naregitim.com/cozumlerimiz` — atölye sayfası için Ceylan hanımın verdiği
  somut tasarım referansı. İncelenmedi.

---

## Sıradaki iş

1. **Ceylan hanıma haber ver.** Site zaten yayında, o görmedi.
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

---

## İstanbul devir listesi

### 1 · Depoyu al

```bash
git clone https://github.com/MertBal-Dev/afloday.git
cd afloday
npm install
```

### 2 · .env oluştur (depoda yok, iki satır)

```
SITE_URL=https://afloday.vercel.app
PREVIEW=1
```

### 3 · Çalıştığını doğrula

```bash
node _build/build.mjs && node _build/verify.mjs   # 0 sorun
npm run build                                     # üretim derlemesi
cd out && python -m http.server 8899              # önizleme
```

**Zip gerekmiyor.** Ceylan hanımın belgeleri `docs/kaynak/`, marka
dosyaları `docs/marka/`, denetim betikleri `_audit/denetim/` içinde —
hepsi depoda.

### 4 · İstanbul'da gözden geçirilecekler

| Konu | Durum | Not |
|---|---|---|
| Etkinlik mozaik düzeni | son hâli kuruldu | üç tur sürdü, birlikte bakılacak |
| Sayfa uzunlukları | etkinlik 10.6 ekran | düzen ritmi uğruna uzadı, kısaltılabilir |
| Doğal tema (koyu yeşil bant) | yapılmadı | `#1B3C1C`, krem metin 9.93:1 hazır seçenek |
| Küçük gezinme resimleri | %46 kırpıyor | 96×96 tanıtıcı, öncelik düşük |
| Turuncu düzlem | eklenmedi | kullanıcı iki kez reddetti, seçenek duruyor |
| Anasayfa | dokunulmadı | 11.1 ekran, Ceylan hanımın yorumu bekleniyor |

### 5 · Geri dönüş

Birleştirme yapıldı, `main` = `6ad03b8` ve Vercel bunu yayınlıyor.
Geri almak gerekirse en hızlısı koda dokunmadan Vercel üzerinden:
Deployments → `4b9ea9c` dağıtımı → ⋯ → Promote to Production.

Git'ten:

```bash
git revert -m 1 6ad03b8
git push
```

Tekrar ileri almak: `git merge feedback-2026-08-06 && git push`.
Vercel `main`'den yayınladığı için her push Ceylan hanıma anında yansır.
