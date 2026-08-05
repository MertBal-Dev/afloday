/* Tüm sayfalar tek bir yakalayıcı rota üzerinden üretiliyor.
   İçerik kaynağı `_build/build.mjs` — statik üreteçle aynı dosya, yani
   iki farklı doğruluk kaynağı yok. Klasör adı doğrudan canlı adrese
   karşılık geliyor. */
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { sayfalar } from '@/_build/build.mjs';

type Sayfa = {
  adres: string;
  govde: string;
  baslik: string;
  aciklama: string;
  canonical: string;
  ogGorsel: string;
  jsonLd: string;
};

const tumu = sayfalar as Sayfa[];
const bul = (dilimler?: string[]) => tumu.find((s) => s.adres === (dilimler ?? []).join('/'));

export function generateStaticParams() {
  /* Anasayfa kök adres, yani slug yok — boş dizi olarak veriliyor.

     BİLİNEN GÜRÜLTÜ: `next dev` bu rotada
     "missing param /[[...slug]]" hatası basıyor. İsteğe bağlı yakalayıcı
     rota ile `output: 'export'` birlikte kullanılınca Next'in geliştirme
     modundaki doğrulaması kökü tanımıyor; `undefined` da `[]` de aynı
     uyarıyı veriyor. Üretim derlemesi etkilenmiyor: `npm run build`
     19 sayfayı ve out/index.html'i doğru üretiyor, tüm adresler 200. */
  return tumu.map((s) => ({ slug: s.adres ? s.adres.split('/') : [] }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = bul(slug);
  if (!s) return {};
  return {
    title: s.baslik,
    description: s.aciklama,
    alternates: { canonical: s.canonical },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      siteName: 'Afloday',
      title: s.baslik,
      description: s.aciklama,
      url: s.canonical,
      images: [{
        url: s.ogGorsel,
        width: 1200,
        height: 630,
        alt: 'Afloday — Çiçekli Bir Gün. Doğadan Gelişim Atölyesi.',
      }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function Sayfa({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const s = bul(slug);
  if (!s) notFound();
  return (
    <>
      {s.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: s.jsonLd }} />
      )}
      <div dangerouslySetInnerHTML={{ __html: s.govde }} />
    </>
  );
}
