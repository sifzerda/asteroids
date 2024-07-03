const typeDefs = `

  type User {
    _id: ID
    username: String
    email: String
    password: String
    mineScore: [AstScore]
  }

    type AstScore {
    astPoints: Int
    astTimeTaken: Int
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
    saveAstScore(userId: ID!, astPoints: Int!, astTimeTaken: Int!): User
  }
`;

module.exports = typeDefs;
