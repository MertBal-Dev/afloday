/* Sitemap — adresler build.mjs'teki tek kaynaktan geliyor, elle liste tutulmuyor.
   Atölye sayfaları katalog niteliğinde olduğu için önceliği düşük. */
import type { MetadataRoute } from 'next';
import { sayfalar } from '@/_build/build.mjs';

type Sayfa = { adres: string; kaynakDosya: string };

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const bugun = new Date();
  return (sayfalar as Sayfa[]).map((s) => ({
    url: `https://www.afloday.com/${s.adres}`,
    lastModified: bugun,
    changeFrequency: 'monthly' as const,
    priority: s.adres === '' ? 1.0 : s.kaynakDosya.startsWith('atolye-') ? 0.6 : 0.8,
  }));
}
