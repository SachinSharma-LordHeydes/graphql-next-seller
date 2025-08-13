import { PrismaClient } from "@/app/generated/prisma";
import { generateUniqueSlug } from "@/servers/utils/slugfy";
import { requireAuth } from "../../auth/auth";
import { GraphQLContext } from "../../context";

const prisma = new PrismaClient();

export const productResolvers = {
  Query: {
    getProducts: async (_: any, __: any, ctx: GraphQLContext) => {
      requireAuth(ctx);

      return prisma.product.findMany({
        include: {
          seller: true,
          variants: true,
          images: true,
          reviews: true,
          Category: {
            include: {
              children: true,
              parent: true,
            },
          },
          Brand: true,
          WishlistItem: true,
        },
      });
    },
    getProduct: async (
      _: any,
      { productId }: { productId: string },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);

      if (!productId) throw new Error("Product id is required");

      return prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          seller: true,
          variants: true,
          images: true,
          reviews: true,
          Category: {
            include: {
              children: true,
              parent: true,
            },
          },
          Brand: true,
          WishlistItem: true,
        },
      });
    },
  },
  Mutation: {
    addProduct: async (
      _: any,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      try {
        const { user } = context;
        console.log("ussr-->", user);
        console.log("input data-->", input);
        if (!user || user.role !== "SELLER") {
          throw new Error("Unauthorized: Only sellers can add products");
        }

        if (!input.name) {
          throw new Error("Product name is required");
        }
        if (!input.variants || !input.variants.length) {
          throw new Error("At least one variant is required");
        }
        if (!input.images || !input.images.length) {
          throw new Error("At least one primary image is required");
        }

        for (const variant of input.variants) {
          if (!variant.sku) throw new Error("SKU is required for each variant");
          if (variant.price == null || isNaN(Number(variant.price)))
            throw new Error("Valid price is required for each variant");
          if (variant.stock == null || isNaN(Number(variant.stock)))
            throw new Error(
              "Valid stock quantity is required for each variant"
            );
        }

        const sellerId = user.id;

        // Combine images and promotionalImages into a single array with appropriate types
        const allImages = [
          ...(input.images || []).map((img) => ({ ...img, type: "PRIMARY" })),
          ...(input.promotionalImages || []).map((img) => ({
            ...img,
            type: "PROMOTIONAL",
          })),
        ];

        const slug = await generateUniqueSlug(input.name);

        const product = await prisma.product.create({
          data: {
            name: input.name,
            slug,
            description: input.description,
            status: input.status || "DRAFT",
            categoryId: input.categoryId || null,
            brandId: input.brandId || null,
            sellerId,
            variants: {
              create: input.variants.map((variant) => ({
                sku: variant.sku,
                price: variant.price,
                stock: variant.stock,
                attributes: variant.attributes || null,
                isDefault: variant.isDefault,
                specifications: {
                  create: variant.specifications.map((spec) => ({
                    key: spec.key,
                    value: spec.value,
                  })),
                },
              })),
            },
            images: {
              create: allImages.map((img) => ({
                url: img.url,
                altText: img.altText || null,
                sortOrder: img.sortOrder,
                type: img.type,
              })),
            },
          },
          include: {
            variants: {
              include: {
                specifications: true,
              },
            },
            images: {
              include: {
                product: true,
              },
            },
            seller: true,
            Category: true,
            Brand: true,
          },
        });

        console.log("product-->", product);

        return product;
      } catch (error: any) {
        console.log("error while creating product", error);
        throw new Error(`Failed to create product: ${error.message}`);
      }
    },
  },
};
