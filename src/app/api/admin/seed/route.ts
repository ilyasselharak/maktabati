import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/middleware/auth";
import dbConnect from "../../../../lib/utils/database";
import Category from "../../../../lib/models/Category";
import Product from "../../../../lib/models/Product";

const sampleCategories = [
  { name: "Textbooks", description: "Academic textbooks for all subjects" },
  { name: "Notebooks", description: "Notebooks and writing pads" },
  { name: "Stationery", description: "Pens, pencils, and writing supplies" },
  { name: "Art Supplies", description: "Drawing and painting materials" },
  { name: "Calculators", description: "Scientific and graphing calculators" },
  { name: "Bags & Cases", description: "Backpacks and pencil cases" },
];

const sampleProducts = [
  {
    name: "Mathematics Textbook - Algebra",
    description:
      "Comprehensive algebra textbook for high school students with solved examples and practice problems.",
    price: 45.99,
    category: "Textbooks",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    ],
  },
  {
    name: "Scientific Calculator",
    description:
      "Advanced scientific calculator with graphing capabilities and 2-line display.",
    price: 89.99,
    category: "Calculators",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=400&h=400&fit=crop",
    ],
  },
  {
    name: "Premium Notebook Set",
    description:
      "Set of 5 premium spiral notebooks with 200 pages each, perfect for note-taking.",
    price: 24.99,
    category: "Notebooks",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop",
    ],
  },
  {
    name: "Art Supply Kit",
    description:
      "Complete art supply kit including colored pencils, markers, sketchbook, and paints.",
    price: 67.99,
    category: "Art Supplies",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    ],
  },
  {
    name: "School Backpack",
    description:
      "Durable waterproof backpack with multiple compartments for books and supplies.",
    price: 39.99,
    category: "Bags & Cases",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    ],
  },
  {
    name: "Mechanical Pencil Set",
    description:
      "Professional mechanical pencil set with 0.5mm and 0.7mm leads and erasers.",
    price: 18.99,
    category: "Stationery",
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
    ],
  },
];

export async function POST(request: NextRequest) {
  const { user, response } = await authenticateRequest(request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Create categories
    const createdCategories = [];
    for (const catData of sampleCategories) {
      const existingCategory = await Category.findOne({ name: catData.name });
      if (!existingCategory) {
        const category = new Category(catData);
        await category.save();
        createdCategories.push(category);
      } else {
        createdCategories.push(existingCategory);
      }
    }

    // Create products
    const createdProducts = [];
    for (const prodData of sampleProducts) {
      const category = createdCategories.find(
        (cat) => cat.name === prodData.category
      );
      if (category) {
        const existingProduct = await Product.findOne({ name: prodData.name });
        if (!existingProduct) {
          const product = new Product({
            ...prodData,
            category: category._id,
          });
          await product.save();
          createdProducts.push(product);
        }
      }
    }

    return NextResponse.json({
      message: "Sample data seeded successfully",
      categoriesCreated: createdCategories.length,
      productsCreated: createdProducts.length,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
