import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إتمام الشراء - مكتبتي",
  description:
    "أكمل طلبك بسهولة وأمان. الدفع عند الاستلام متاح. شحن مجاني للطلبات فوق 400 درهم.",
  keywords: ["إتمام الشراء", "مكتبتي", "طلب", "دفع", "المغرب"],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "إتمام الشراء - مكتبتي",
    description: "أكمل طلبك بسهولة وأمان",
    type: "website",
    locale: "ar_MA",
    url: "https://maktabati.ma/checkout",
  },
  twitter: {
    card: "summary",
    title: "إتمام الشراء - مكتبتي",
    description: "أكمل طلبك بسهولة وأمان",
  },
  alternates: {
    canonical: "https://maktabati.ma/checkout",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
