import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maktabati.ma";
  const baseApiUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

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

  // Fetch products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseApiUrl}/api/products?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      productRoutes = (data.products || []).map((product: { slug?: string; _id: string; updatedAt?: string }) => ({
        url: `${baseUrl}/products/${product.slug || product._id}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Fetch categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseApiUrl}/api/admin/categories`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      categoryRoutes = (data.categories || []).map((category: { slug?: string; _id: string; updatedAt?: string }) => ({
        url: `${baseUrl}/categories/${category.slug || category._id}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
