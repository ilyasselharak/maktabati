import type { MetadataRoute } from "next";
import dbConnect from "@/lib/utils/database";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maktabati.ma";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true, slug: { $exists: true } })
      .select("slug updatedAt")
      .lean();
    productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${(p as Record<string, unknown>).slug}`,
      lastModified: (p as Record<string, unknown>).updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const categories = await Category.find({ slug: { $exists: true } })
      .select("slug updatedAt")
      .lean();
    categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
