import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "جميع المنتجات - مكتبتي",
  description:
    "اكتشف مجموعتنا الكاملة من لوازم المدرسة والكتب والأدوات التعليمية. تصفح وتسوق بسهولة.",
  keywords: ["منتجات", "مكتبتي", "لوازم مدرسية", "كتب", "المغرب", "تسوق"],
  openGraph: {
    title: "جميع المنتجات - مكتبتي",
    description: "اكتشف مجموعتنا الكاملة من لوازم المدرسة والكتب",
    type: "website",
    locale: "ar_MA",
    url: "https://maktabati.ma/products",
  },
  twitter: {
    card: "summary_large_image",
    title: "جميع المنتجات - مكتبتي",
    description: "اكتشف مجموعتنا الكاملة من لوازم المدرسة والكتب",
  },
  alternates: {
    canonical: "https://maktabati.ma/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
