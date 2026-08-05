# Kaynak dosyalar

Bu klasör, içerik doğrulamasının **tek dayanağı**. Orijinal `.docx` ve `.xlsx`
geliştiricinin kendi bilgisayarındaydı; başka makinede çalışılabilsin diye
çıkarılmış hâlleri depoya alındı.

## belge-tam.txt (551 satır)

`Afloday_WEB Sayfası Metinler_04082026.docx` dosyasının tam metni.
Tablolar dahil, paragraf sırası korunmuş. `[TABLO BAŞI]`, `[HÜCRE]`,
`[TABLO SONU]` işaretleri tablo yapısını gösteriyor.

Yeniden üretmek için (orijinal .docx elindeyse):
`python _audit/denetim/cikar.py`

**Bölüm haritası:**

```
  1-117  Anasayfa            118-122  Kurumsal Hizmetler
123-164  Sosyal Sorumluluk   165-183  Hakkımızda
184-295  Doğa Temelli Eğitimler   296-389  Geleceği Doğadan Tasarla
390-407  Ceylan özgeçmişi    408-551  Etkinlik Atölyeleri
```

## envanter.tsv (35 satır)

`Afloday_Mevcut_Site_Envanteri_Dolu.xlsx` — sütunlar sekmeyle ayrılmış:
`No · Sayfa Başlığı · URL · Sayfa · DURUM · Not`

DURUM değerleri: `OK` (korunacak) · `Yenilenecek` · `İPTAL` · `Yeni Sayfa`

Başlıklarda `|` karakteri geçtiği için sekme ayracı şart; boru ayracıyla
ayrıştırırsan sütunlar kayar.

## _audit/orijinal/ (34 dosya)

Canlı afloday.com'un sayfa sayfa metin dökümü. İçerik doğrulamasının ikinci
kaynağı: Excel'de `OK` yazan sayfaların metni belgede değil burada.

**Dikkat:** döküm küçük harfe çevrilmiş ve birleştirilmiş aksan taşıyor.
Karşılaştırırken iki tarafı da küçült ve NFC uygula, yoksa Türkçe metinler
"kaynaksız" görünür.
