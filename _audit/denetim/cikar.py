# -*- coding: utf-8 -*-
"""docx'ten metni eksiksiz çıkarır: gövde paragrafları, tablo hücreleri,
metin kutuları. Belge sırası korunur.

Önceki çıkarım <w:t> etiketlerini düz toplamıştı; tablo yapısı kaybolduğu
için hücre metinleri paragraflara karışmış, ham XML parçaları metne
sızmıştı. Bu sürüm XML ağacını gezerek sırayı ve sınırları koruyor.
"""
import io
import zipfile
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
KAYNAK = ('C:/Users/Gaming/Downloads/wetransfer_afloday-web-metin-ve-gorseller_'
          '2026-08-04_1711/Afloday Web Metin ve Görseller/'
          'Afloday_WEB Sayfası Metinler_04082026.docx')
HEDEF = ('C:/Users/Gaming/AppData/Local/Temp/claude/'
         'c--Users-Gaming-Desktop-Afloday/9762a584-306b-4526-88f3-6d66de01acda/'
         'scratchpad/belge-tam.txt')


def paragraf_metni(p):
    """Bir <w:p> içindeki tüm metin parçalarını birleştirir."""
    parcalar = []
    for t in p.iter(W + 't'):
        parcalar.append(t.text or '')
    # satır sonu ve sekmeler
    return ''.join(parcalar).strip()


def gez(el, cikti, derinlik=0):
    """Gövdeyi sırayla gezer; paragraf ve tabloyu ayrı ayrı toplar."""
    for c in el:
        etiket = c.tag
        if etiket == W + 'p':
            m = paragraf_metni(c)
            if m:
                cikti.append(m)
        elif etiket == W + 'tbl':
            cikti.append('[TABLO BAŞI]')
            for satir in c.findall(W + 'tr'):
                hucreler = []
                for hucre in satir.findall(W + 'tc'):
                    ic = []
                    gez(hucre, ic, derinlik + 1)
                    hucreler.append(' / '.join(x for x in ic if not x.startswith('[TABLO')))
                dolu = [h for h in hucreler if h]
                if dolu:
                    cikti.append('[HÜCRE] ' + ' || '.join(dolu))
            cikti.append('[TABLO SONU]')
        else:
            # sdt (içerik denetimi), metin kutusu vb. içindeki paragraflar
            gez(c, cikti, derinlik)


with zipfile.ZipFile(KAYNAK) as z:
    parcalar = [n for n in z.namelist()
                if n.startswith('word/') and n.endswith('.xml')
                and ('document' in n or 'header' in n or 'footer' in n
                     or 'footnotes' in n or 'endnotes' in n)]
    parcalar.sort(key=lambda n: (0 if 'document' in n else 1, n))

    tum = []
    for ad in parcalar:
        kok = ET.fromstring(z.read(ad))
        gecici = []
        gez(kok, gecici)
        if gecici:
            tum.append('===== %s =====' % ad)
            tum.extend(gecici)

with io.open(HEDEF, 'w', encoding='utf-8') as f:
    f.write('\n'.join(tum))

print('satir:', len(tum))
print('kaynak parca:', len(parcalar))
