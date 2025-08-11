import { gql } from "@apollo/client";

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    categories {
      id
      name
      children {
        id
        name
        categorySpecification {
          id
          key
          label
          placeholder
        }
      }
      categorySpecification {
        id
        key
        label
        placeholder
      }
    }
  }
`;
