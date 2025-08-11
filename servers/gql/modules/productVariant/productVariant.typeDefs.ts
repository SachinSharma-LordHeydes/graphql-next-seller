import { gql } from "graphql-tag";

export const productVariantTypeDefs = gql`
  scalar Decimal
  scalar Json
  scalar DateTime

  type ProductVariant {
    id: ID!
    productId: String!
    sku: String!
    price: Decimal!
    stock: Int!
    attributes: Json
    isDefault: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!

    product: Product!
    specifications: [ProductSpecification!]
    cartItems: [CartItem!]
    orderItems: [OrderItem!]
    SellerOrderItem: [SellerOrderItem!]
  }
  input CreateProductVariantInput {
    sku: String!
    price: Decimal!
    stock: Int!
    attributes: Json 
    isDefault: Boolean = false
    specifications: [CreateProductSpecificationInput!]! 
  }
`;
