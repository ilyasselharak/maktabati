import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/categories", "/about", "/contact"],
        disallow: ["/admin/", "/api/", "/cart", "/checkout", "/test-*"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/products", "/categories", "/about", "/contact"],
        disallow: ["/admin/", "/api/", "/cart", "/checkout"],
      },
    ],
    sitemap: "https://maktabati.ma/sitemap.xml",
    host: "https://maktabati.ma",
  };
}
