import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن - مكتبتي",
  description:
    "تعرف على مكتبتي - متجر لوازم المدرسة الرائد في المغرب. نقدم منتجات عالية الجودة بأسعار منافسة مع توصيل سريع.",
  keywords: ["من نحن", "مكتبتي", "لوازم مدرسية", "المغرب", "عن المتجر"],
  openGraph: {
    title: "من نحن - مكتبتي",
    description: "تعرف على مكتبتي - متجر لوازم المدرسة الرائد في المغرب",
    type: "website",
    locale: "ar_MA",
    url: "https://maktabati.ma/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "من نحن - مكتبتي",
    description: "تعرف على مكتبتي - متجر لوازم المدرسة الرائد في المغرب",
  },
  alternates: {
    canonical: "https://maktabati.ma/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
