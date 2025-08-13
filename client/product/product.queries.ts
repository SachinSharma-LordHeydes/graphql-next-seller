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

export const GET_PRODUCT = gql`
  query GetProduct($productId: ID!) {
    getProduct(productId: $productId) {
      id
      name
      brandId
      categoryId
      description
      variants {
        sku
        price
        stock
        specifications {
          key
          value
        }
      }
      images {
        url
        altText
        type
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      slug
      images {
        url
      }
      status
      variants {
        sku
        price
        stock
      }
      Category {
        parent {
          name
          id
        }
      }
    }
  }
`;
