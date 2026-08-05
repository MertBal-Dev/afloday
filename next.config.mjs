/** Afloday — Next.js yapılandırması
 *  Faz 1: tamamen statik üretim. Panel geldiğinde (Faz 2) sunucu tarafı devreye
 *  girecek; o zaman `output` satırı kaldırılacak.
 *
 *  trailingSlash kapalı ve uzantı yok — canlı afloday.com adresleri böyle. */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },   // statik dışa aktarımda görsel iyileştirme yok
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
