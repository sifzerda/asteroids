const typeDefs = `

  type User {
    _id: ID
    username: String
    email: String
    password: String
    mineScore: [MineScore]
  }

    type MineScore {
    minePoints: Int
    mineTimeTaken: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(userId: ID!): User
    users: [User]
    me: User
    getMineScore(userId: ID!): [MineScore]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    removeUser: User
    saveMineScore(userId: ID!, minePoints: Int!, mineTimeTaken: Int!): User
  }
`;

module.exports = typeDefs;
