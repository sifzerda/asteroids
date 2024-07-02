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
      mineScore {
        minePoints
        mineTimeTaken
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
            mineScore {
        minePoints
        mineTimeTaken
      }
    }
  }
`;

export const GET_MINE_SCORE = gql`
  query getMineScore($userId: ID!) {
    getMineScore(userId: $userId) {
      minePoints
      minetimeTaken
    }
  }
`;


