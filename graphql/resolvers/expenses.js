const { UserInputError, AuthenticationError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const Expense = require("../../models/Expenses");
const Trip = require("../../models/Trip");
const { validateExpenseInput } = require("../../util/validators");

module.exports = {
  Mutation: {
    createExpense: async (
      _,
      { tripId, name, cost, category, currency, rate, paidBy },
      context
    ) => {
      const user = checkAuth(context);
      const { valid, errors } = validateExpenseInput(
        name,
        cost,
        category,
        currency
      );
      if (!valid) {
        throw new UserInputError("Errors!", { errors });
      }

      const trip = await Trip.findById(tripId);
      const newExpense = new Expense({name, cost, category, currency, rate, username: user.username, paidBy, createdAt: new Date().toISOString()})

      trip.expenses.unshift(newExpense);
      await trip.save();
      return trip;
    },
    deleteExpense: async (_, { tripId, expenseId }, context) => {
      const user = checkAuth(context);
      const trip = await Trip.findById(tripId);
      if (trip) {
        const index = trip.expenses.findIndex((el) => el.id === expenseId);

        trip.expenses.splice(index, 1);
        await trip.save();
        return trip;
      } else {
        throw new UserInputError("not found");
      }
    },
    modifyExpense: async (_, { tripId, name, cost, category, currency, rate, expenseId, paidBy }, context) => {
      const user = checkAuth(context);
      const trip = await Trip.findById(tripId);
      if (trip) {
        const index = trip.expenses.findIndex((el) => el.id === expenseId);

        trip.expenses[index].name = name;
        trip.expenses[index].cost = cost;
        trip.expenses[index].category = category;
        trip.expenses[index].paidBy = paidBy
                //trip.expenses[index].currency = currency;
        //trip.expenses[index].rate = rate;

        await trip.save();
        return trip;
      } else {
        throw new UserInputError("not found");
      }
    },
  },
};
