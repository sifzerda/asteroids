import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query getUser($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      email
    }
  }
`;

export const QUERY_USERS = gql`
  {
    users {
      _id
      username
      email
      astScore {
        astPoints
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
            astScore {
        astPoints
      }
    }
  }
`;

export const GET_AST_SCORE = gql`
  query getAstScore($userId: ID!) {
    getAstScore(userId: $userId) {
      astPoints
    }
  }
`;


