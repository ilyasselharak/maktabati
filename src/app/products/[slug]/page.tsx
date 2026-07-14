import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "المنتج غير موجود - مكتبتي",
      description: "المنتج الذي تبحث عنه غير متوفر في متجر مكتبتي.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} - مكتبتي`;
  const description =
    product.description?.length > 160
      ? product.description.slice(0, 157) + "..."
      : product.description || "منتج من مكتبتي - متجر لوازم المدرسة في المغرب";
  const imageUrl = product.images?.[0] || "/banner.png";
  const keywords = [
    product.name,
    product.category?.name,
    ...(product.tags || []),
    "مكتبتي",
    "لوازم مدرسية",
    "المغرب",
  ].filter(Boolean);

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
      type: "article",
      locale: "ar_MA",
      url: `https://maktabati.ma/products/${slug}`,
      siteName: "مكتبتي",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      site: "@maktabati",
      creator: "@maktabati",
    },
    alternates: {
      canonical: `https://maktabati.ma/products/${slug}`,
    },
    other: {
      "product:price:amount": product.price?.toString() || "0",
      "product:price:currency": "MAD",
      "product:availability": product.stock > 0 ? "instock" : "outofstock",
      "product:category": product.category?.name || "",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient slug={slug} />;
}
