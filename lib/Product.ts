"use server";

import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function createProduct(data: {
  name: string;
  userId: string;
  price: number;
  description: string;
 
  min_order_quantity: number;
  hsn_code: string;
  condition: "new" | "used" | "refurbished";
  category: string;
  preference: "private" | "selected_countries" | "public";
  prefered_countries: string[];
  total_quantity: number;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        userId: data.userId,
        price: data.price,
        description: data.description,
       // toatal_quantity: data.toatal_quantity,
        min_order_quantity: data.min_order_quantity,
        hsn_code: data.hsn_code,
        condition: data.condition,
        category: data.category,
        preference: data.preference,
        total_quantity: data.total_quantity,
       // prefered_countries: data.prefered_countries,
      },
    });

    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error };
  }
}

export async function getAllProducts() {
    try {
      const products = await prisma.product.findMany({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              workEmail: true,
              country: true,
            },
          },
        },
      });
  
      return {
        success: true,
        message: "Products fetched successfully",
        data: products,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Error fetching products:", error);
  
      return {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      };
    } finally {
      await prisma.$disconnect();
    }
  }