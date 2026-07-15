import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "../../../lib/utils/database";
import Product from "../../../lib/models/Product";
import mongoose from "mongoose";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    await dbConnect();

    let product = await Product.findOne({ slug }).populate("category", "name slug");

    if (!product && mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug).populate("category", "name slug");
    }

    if (!product) return null;

    if (!product.slug) {
      const { slugify } = await import("../../../lib/utils/slugify");
      let newSlug = slugify(product.name);
      if (!newSlug) newSlug = "product";
      let suffix = 1;
      const baseSlug = newSlug;
      while (await Product.findOne({ slug: newSlug, _id: { $ne: product._id } })) {
        newSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }
      product.slug = newSlug;
      await product.save();
    }

    if (!product.isActive) return null;

    return product;
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
