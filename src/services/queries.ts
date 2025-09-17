import { gql } from '@apollo/client';

export const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
    }
  }
`;

export const GET_COUNTRIES_BY_CONTINENT = gql`
  query GetCountriesByContinent($continentCode: String!) {
    countries(filter: { continent: { eq: $continentCode } }) {
      code
      name
      emoji
      currency
      continent {
        code
        name
      }
      languages {
        code
        name
      }
    }
  }
`;

export const GET_ALL_COUNTRIES = gql`
  query GetAllCountries {
    countries {
      code
      name
      emoji
      currency
      continent {
        code
        name
      }
      languages {
        code
        name
      }
    }
  }
`;

export const GET_COUNTRY_DETAILS = gql`
  query GetCountryDetails($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      currency
      continent {
        code
        name
      }
      languages {
        code
        name
      }
    }
  }
`;
