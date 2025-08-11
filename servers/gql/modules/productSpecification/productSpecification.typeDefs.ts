import { gql } from "graphql-tag";

export const productSpecificationTypeDefs = gql`
  scalar DateTime

  type ProductSpecification {
    id: ID!
    variantId: String!
    key: String!
    value: String!
    createdAt: DateTime!
    updatedAt: DateTime!

    variant: ProductVariant!
  }
  input CreateProductSpecificationInput {
    key: String!
    value: String!
  }
`;
