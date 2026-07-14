import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا - مكتبتي",
  description:
    "تواصل مع مكتبتي - فريق خدمة العملاء جاهز لمساعدتك. أرسل لنا رسالتك وسنرد عليك في أقرب وقت.",
  keywords: ["اتصل بنا", "مكتبتي", "دعم العملاء", "المغرب", "خدمة العملاء"],
  openGraph: {
    title: "اتصل بنا - مكتبتي",
    description: "تواصل مع مكتبتي - فريق خدمة العملاء جاهز لمساعدتك",
    type: "website",
    locale: "ar_MA",
    url: "https://maktabati.ma/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "اتصل بنا - مكتبتي",
    description: "تواصل مع مكتبتي - فريق خدمة العملاء جاهز لمساعدتك",
  },
  alternates: {
    canonical: "https://maktabati.ma/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
