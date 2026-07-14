import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/categories/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.category || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "الفئة غير موجودة - مكتبتي",
      description: "الفئة التي تبحث عنها غير متوفرة في متجر مكتبتي.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${category.name} - مكتبتي`;
  const description =
    category.description ||
    `تصفح مجموعة ${category.name} من مكتبتي. لوازم مدرسية عالية الجودة بأسعار مناسبة.`;
  const keywords = [category.name, "مكتبتي", "لوازم مدرسية", "المغرب", "كتب", "أدوات كتابة"].filter(
    Boolean
  );

  return {
    title,
    description,
    keywords,
    authors: [{ name: "مكتبتي" }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_MA",
      url: `https://maktabati.ma/categories/${slug}`,
      siteName: "مكتبتي",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@maktabati",
      creator: "@maktabati",
    },
    alternates: {
      canonical: `https://maktabati.ma/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  return <CategoryPageClient slug={slug} />;
}
