import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سلة التسوق - مكتبتي",
  description:
    "راجع منتجاتك في سلة التسوق وأكمل عملية الشراء بسهولة. شحن مجاني للطلبات فوق 400 درهم.",
  keywords: ["سلة التسوق", "مكتبتي", "شراء", "الدفع", "المغرب"],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "سلة التسوق - مكتبتي",
    description: "راجع منتجاتك في سلة التسوق وأكمل عملية الشراء بسهولة",
    type: "website",
    locale: "ar_MA",
    url: "https://maktabati.ma/cart",
  },
  twitter: {
    card: "summary",
    title: "سلة التسوق - مكتبتي",
    description: "راجع منتجاتك في سلة التسوق",
  },
  alternates: {
    canonical: "https://maktabati.ma/cart",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
