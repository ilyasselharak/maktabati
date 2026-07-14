import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Amiri, Tajawal } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maktabati.ma"),
  title: {
    default: "مكتبتي - متجر لوازم المدرسة في المغرب",
    template: "%s - مكتبتي",
  },
  description:
    "متجر مكتبتي - وجهتك الأولى للوازم المدرسية والكتب والأدوات التعليمية في المغرب. توصيل سريع، أسعار منافسة، وجودة عالية.",
  keywords: [
    "مكتبتي",
    "لوازم مدرسية",
    "كتب مدرسية",
    "أدوات كتابة",
    "لوازم الفنون",
    "حاسبات",
    "متجر المغرب",
    "قرطاسية",
    "تجهيزات المدرسة",
  ],
  authors: [{ name: "مكتبتي" }],
  creator: "مكتبتي",
  publisher: "مكتبتي",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_MA",
    siteName: "مكتبتي",
    title: "مكتبتي - متجر لوازم المدرسة في المغرب",
    description:
      "متجر مكتبتي - وجهتك الأولى للوازم المدرسية والكتب والأدوات التعليمية في المغرب.",
    images: [
      {
        url: "/banner.png",
        width: 1440,
        height: 400,
        alt: "مكتبتي - لوازم المدرسة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maktabati",
    creator: "@maktabati",
    title: "مكتبتي - متجر لوازم المدرسة في المغرب",
    description:
      "متجر مكتبتي - وجهتك الأولى للوازم المدرسية والكتب والأدوات التعليمية في المغرب.",
    images: ["/banner.png"],
  },
  alternates: {
    canonical: "https://maktabati.ma",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  category: "shopping",
  classification: "Business",
  other: {
    "application-name": "مكتبتي",
    "apple-mobile-web-app-title": "مكتبتي",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "theme-color": "#a780f8",
    "msapplication-TileColor": "#a780f8",
  },
};

function JsonLd() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "مكتبتي",
    url: "https://maktabati.ma",
    logo: "https://maktabati.ma/logo.png",
    description:
      "متجر لوازم المدرسة في المغرب - كتب، أدوات كتابة، لوازم فنية، وحاسبات",
    sameAs: [
      "https://facebook.com/maktabati",
      "https://instagram.com/maktabati",
      "https://twitter.com/maktabati",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+212-XXX-XXXXXX",
      contactType: "customer service",
      areaServed: "MA",
      availableLanguage: ["Arabic", "French"],
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "مكتبتي",
    url: "https://maktabati.ma",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://maktabati.ma/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "مكتبتي",
    image: "https://maktabati.ma/logo.png",
    url: "https://maktabati.ma",
    telephone: "+212-XXX-XXXXXX",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      addressRegion: "Casablanca-Settat",
      addressLocality: "الدار البيضاء",
    },
    priceRange: "$$",
    openingHours: "Mo-Sa 09:00-18:00",
    paymentAccepted: "COD, Bank Transfer",
    currenciesAccepted: "MAD",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#a780f8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${tajawal.variable} antialiased font-tajawal rtl bg-gray-50`}
        dir="rtl"
      >
        <HeaderWrapper />
        <main className="min-h-screen" dir="rtl">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
