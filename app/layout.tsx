/* Afloday — kök kabuk.
   Gövdenin tamamı (başlık bandı, main, altbilgi) sayfa tarafından basılıyor;
   burada yalnızca belge iskeleti, yazı tipleri ve etkileşim betiği duruyor.
   Amaç statik sürümle birebir aynı çıktı. */
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.afloday.com'),
};

export const viewport = {
  themeColor: '#E9E9E0',
  width: 'device-width',
  initialScale: 1,
};

/* suppressHydrationWarning — aşağıdaki inline betik React yüklenmeden
   <html>'e `js` sınıfını ekliyor. Sunucudan gelen HTML'de o sınıf yok, bu
   yüzden React uyuşmazlık uyarısı veriyordu. Fark kasıtlı ve tek seferlik:
   sınıfı React'e bıraksaydık boyamadan sonra eklenirdi ve JS kapalıyken
   içeriğin görünmesini sağlayan mantık bozulurdu. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/img/brand/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..500&display=swap"
        />
        <link rel="stylesheet" href="/assets/css/afloday.css" />
        {/* Boyamadan önce çalışmalı: JS açıkken açığa çıkarma animasyonları
            devreye giriyor, kapalıyken içerik doğrudan görünüyor. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
      </head>
      <body>
        {children}
        <Script src="/assets/js/afloday.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
