const typeDefs = `

  type User {
    _id: ID
    username: String
    email: String
    password: String
    astScore: [AstScore]
  }

    type AstScore {
    astPoints: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(userId: ID!): User
    users: [User]
    me: User
    getAstScore(userId: ID!): [AstScore]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    removeUser: User
    saveAstScore(userId: ID!, astPoints: Int!): User
  }
`;

module.exports = typeDefs;
