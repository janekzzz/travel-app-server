const tripResolvers = require("./trips");
const userResolvers = require("./users");
const commentsResolvers = require("./comments");
const expenseResolvers = require("./expenses");

module.exports = {
  Trip: {
    totalExpense(parent) {
      let total = 0;
      parent.expenses.forEach((acc) => {
        total += acc.cost/acc.rate;
      });
      return total;
    },
    dailyExpense(parent) {
      let total = 0;
      parent.expenses.forEach((acc) => {
        total += acc.cost/acc.rate;
      });
      return (total / parent.days).toFixed(2);
    },
    expensesByCategory(parent) {
      let categoryNames=[];
      
      let temp = [];
      
      parent.expenses.forEach(el=> {
        if (!categoryNames.includes(el.category)) categoryNames.push(el.category)});
      
      let total = 0;
      parent.expenses.forEach((acc) => {
        total += acc.cost*acc.rate;
      });

      categoryNames.forEach((cat,index)=>{
        
        temp.push({
          id: index,
          categoryName: cat,
          totalExpense: 0,
          expenseCount: 0,
          averageExpense:0,
          percentage: 0,
          largestExpense: 0,
          largestExpenseName: ''
        })
      })

      parent.expenses.forEach((expense) => {
        categoryNames.forEach((cat) => {
          if (cat === expense.category) {
            let index = temp.findIndex((el) => el.categoryName === cat);
            temp[index].totalExpense += expense.cost*expense.rate;
            temp[index].expenseCount += 1;
            temp[index].averageExpense =
              temp[index].totalExpense / temp[index].expenseCount;
            if (expense.cost*expense.rate > temp[index].largestExpense)
              {temp[index].largestExpense = expense.cost*expense.rate;
              temp[index].largestExpenseName = expense.name}
            temp[index].percentage =
              (temp[index].totalExpense / total) * 100;

          }
        });
      });
      return temp;
    },
    
  },
  Query: {
    ...tripResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...tripResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...expenseResolvers.Mutation,
  },
};
