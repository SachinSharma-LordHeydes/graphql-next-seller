import { gql } from "graphql-tag";

export const productTypeDefs = gql`
  enum ProductStatus {
    DRAFT
    ACTIVE
    INACTIVE
    DISCONTINUED
  }

  scalar DateTime

  type Product {
    id: ID!
    sellerId: String!
    name: String!
    slug: String!
    description: String
    status: ProductStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
    seller: User!
    variants: [ProductVariant!]
    images: [ProductImage!]
    reviews: [Review!]
    Category: Category
    categoryId: String
    Brand: Brand
    brandId: String
    WishlistItem: [WishlistItem!]
  }

  input CreateProductInput {
    name: String!
    description: String
    status: ProductStatus = DRAFT
    categoryId: String
    brandId: String
    variants: [CreateProductVariantInput!]!
    images: [CreateProductImageInput!]!
    promotionalImages: [CreateProductImageInput!]!
  }

  type Query {
    getProducts: [Product!]!
    getProduct(productId: ID!): Product!
  }

  type Mutation {
    addProduct(input: CreateProductInput!): Product!
  }
`;
