const { gql } = require("apollo-server");

module.exports = gql`
  type Trip {
    id: ID!
    name: String!
    createdAt: String!
    startDate: String!
    endDate: String!
    username: String!
    totalExpense: Float!
    dailyExpense: Float!
    baseCurrency: String!
    expensesByCategory: [ExpenseByCategory]!
    comments: [Comment]!
    expenses: [Expense]!
    days: Int!
    authorizedUsers: [AuthorizedUser]!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Expense {
    id: ID!
    name: String!
    cost: Float!
    currency: String!
    category: String!
    createdAt: String!
    username: String!
    rate: Float!
    paidBy: String!
  }
  type ExpenseByCategory {
    id: ID!
    categoryName: String!
    totalExpense: Float!
    averageExpense: Float!
    largestExpense: Float!
    percentage: Float!
    expenseCount: Int!
    largestExpenseName: String!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type AuthorizedUser {
    username: String!
  }
  type Query {
    getTrips: [Trip]
    getTrip(tripId: ID!): Trip
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createTrip(name: String!, startDate: String!, endDate: String!): Trip!
    deleteTrip(tripId: ID!): String!
    createComment(tripId: ID!, body: String!): Trip!
    deleteComment(tripId: ID!, commentId: ID!): Trip!
    authorizeUser(tripId: ID!, username: String!): Trip!
    unauthorizeUser(tripId: ID!, username: String!): Trip!
    createExpense(
      tripId: ID!
      name: String!
      cost: Float!
      currency: String!
      category: String!
      rate: Float!
      paidBy: String!
    ): Trip!
    deleteExpense(tripId: ID!, expenseId: ID!): Trip!
    modifyExpense(
      expenseId: ID!
      tripId: ID!
      name: String!
      cost: Float!
      currency: String!
      category: String!
      rate: Float!
      paidBy: String!
    ): Trip!
    modifyTrip(
      tripId: ID!
      name:String!
      startDate: String!
      endDate: String!
    ) : Trip!
  }
`;
