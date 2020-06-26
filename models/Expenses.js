const {model, Schema} = require('mongoose');

const expenseSchema = new Schema ({
    cost: String,
    username: String,
    name: String,
    category: String,
    currency: String,
    createdAt: String,
    rate: Number,
    paidBy: String
})

module.exports = model('Expense', expenseSchema);