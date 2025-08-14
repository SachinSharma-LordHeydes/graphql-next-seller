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
      Category {
        name
        id
        parent {
          id
          name
        }
      }
      id
      name
      description
      images {
        id
        url
        type
        altText
      }
      variants {
        price
        sku
        productId
        stock
        specifications {
          key
          value
        }
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
