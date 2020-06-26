const { model, Schema } = require("mongoose");

const tripSchema = new Schema({
  name: String,
  username: String,
  createdAt: String,
  startDate: String,
  endDate: String,
  totalExpense: Number,
  dailyExpense: Number,
  days: Number,
  baseCurrency: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  expenses: [
    {
      username: String,
      name: String,
      cost: Number,
      category: String,
      createdAt: String,
      currency: String,
      rate: Number,
      paidBy: String
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  authorizedUsers: [{ username: String }],
  expensesByCategory: [
    {
      categoryName: String,
      totalExpense: Number,
      averageExpense: Number,
      expenseCount: Number,
      largestExpense: Number,
      percentage: Number,
      largestExpenseName: String
    },
  ],
  
});

module.exports = model("Trip", tripSchema);
