/* Önizleme dağıtımında arama motorları taramasın — müşterinin gerçek sitesiyle
   rekabet etmesin. Yayında PREVIEW değişkeni tanımsız olacak. */
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const onizleme = process.env.PREVIEW === '1';
  return {
    rules: onizleme
      ? { userAgent: '*', disallow: '/' }
      : { userAgent: '*', allow: '/' },
    sitemap: onizleme ? undefined : 'https://www.afloday.com/sitemap.xml',
  };
}
