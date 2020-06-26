const {model, Schema} = require('mongoose');

const expenseByCategorySchema = new Schema ({
    categoryName: String,
    totalExpense: Number,
    expenseCount: Number,
    averageExpense: Number,
    percentage: Number,
    largestExpense: Number,
    rate: Number,
    paidBy: String
})

module.exports = model('Expense', expenseSchema);

/*categoryName: cat,
          totalExpense: 0,
          expenseCount: 0,
          averageExpense:0,
          percentage: 0,
          largestExpense: 0,
          largestExpenseName: ''*/