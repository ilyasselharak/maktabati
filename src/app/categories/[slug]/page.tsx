import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "../../../lib/utils/database";
import Category from "../../../lib/models/Category";
import CategoryPageClient from "./CategoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  try {
    await dbConnect();

    let category = await Category.findOne({ slug });

    if (!category) {
      console.warn(`[CategoryPage] Category not found for slug: "${slug}"`);
      return null;
    }

    // Auto-generate slug if missing
    if (!category.slug) {
      const { slugify } = await import("../../../lib/utils/slugify");
      let newSlug = slugify(category.name);
      if (!newSlug) newSlug = "category";
      let suffix = 1;
      const baseSlug = newSlug;
      while (await Category.findOne({ slug: newSlug, _id: { $ne: category._id } })) {
        newSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }
      category.slug = newSlug;
      await category.save();
    }

    return {
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
    };
  } catch (error) {
    console.error(`[CategoryPage] Error fetching category "${slug}":`, error);
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
