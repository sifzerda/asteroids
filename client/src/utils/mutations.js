import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser {
    removeUser {
      _id
      username
    }
  }
`;

export const SAVE_AST_SCORE = gql`
  mutation saveAstScore($userId: ID!, $astPoints: Int!) {
    saveAstScore(userId: $userId, astPoints: $astPoints) {
      _id
      username
      email
      astScore {
        astPoints
      }
    }
  }
`;

