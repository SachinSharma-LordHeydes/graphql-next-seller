import { gql } from "graphql-tag";

export const productImageTypeDefs = gql`
  enum ImageType {
    PRIMARY
    PROMOTIONAL
  }

  type ProductImage {
    id: ID!
    variantId: String
    productId: String!
    url: String!
    altText: String
    sortOrder: Int!
    type: ImageType!

    product: Product!
  }
  input CreateProductImageInput {
    url: String!
    altText: String
    sortOrder: Int = 0
    type: ImageType = PRIMARY
  }
`;
