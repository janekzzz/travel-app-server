const Trip = require("../../models/Trip");
const User = require("../../models/Users");
const checkAuth = require("../../util/check-auth");
const { AuthenticationError } = require("apollo-server");

const { UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getTrips(_, args, context) {
      const user = checkAuth(context);

      try {
        const trips = await Trip.find().sort({ createdAt: -1 });
        const tripsAdmin = await Trip.find({ username: user.username }).sort({
          createdAt: -1,
        });
        let authTrips = [];
        if (tripsAdmin) authTrips = authTrips.concat(tripsAdmin);
        trips.forEach((t) => {
          let tIndex = t.authorizedUsers.findIndex(
            (ta) => ta.username === user.username
          );
          if (tIndex !== -1) authTrips.push(t);
        });

        return authTrips;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTrip(_, { tripId }) {
      try {
        const trip = await Trip.findById(tripId);
        if (trip) {
          return trip;
        } else {
          throw new Error("Trip not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    modifyTrip: async (
      parent,
      { tripId, name, startDate, endDate },
      context
    ) => {
      const trip = await Trip.findById(tripId);
      if (trip) {
        trip.name = name;
        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.days = Math.floor(
          (Date.parse(endDate) - Date.parse(startDate)) / 86400000
        );

        await trip.save();
        return trip;
      } else {
        throw new UserInputError("not found");
      }
    },
    async createTrip(parent, { name, startDate, endDate }, context) {
      const user = checkAuth(context);

      const newTrip = new Trip({
        name,
        startDate,
        endDate,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        totalExpense: 0,
        dailyExpense: 0,
        expensesByCategory: [],
        expensesByUser: [],
        baseCurrency: "EUR",
        days: Math.floor(
          (Date.parse(endDate) - Date.parse(startDate)) / 86400000
        ),
      });
      const trip = await newTrip.save();
      return trip;
    },
    async deleteTrip(_, { tripId }, context) {
      const user = checkAuth(context);
      try {
        const trip = await Trip.findById(tripId);
        if (user.username === trip.username) {
          await trip.delete();
          return "Trip deleted succesfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async authorizeUser(_, { tripId, username }, context) {
      const user = checkAuth(context);
      const checkUser = await User.findOne({ username });
      const trip = await Trip.findById(tripId);
      let double;
      trip.authorizedUsers.forEach((el) => {
        if (el.username === username) {
          double = true;
        }
      });

      if (!checkUser) {
        throw new UserInputError("User not found!", {
          errors: {
            username: "Username not found!",
          },
        });
      } else if (checkUser.username === user.username) {
        throw new UserInputError("Cannot authorize yourself", {
          errors: {
            username: "Cannot authorize yourself",
          },
        });
      } else if (double) {
        throw new UserInputError("User already authorized!", {
          errors: {
            username: "Already authorized",
          },
        });
      }
      try {
        if (user.username === trip.username) {
          trip.authorizedUsers.unshift({ username });
          await trip.save();
          return trip;
        } else {
          throw new AuthenticationError("Action not allowed", {
            errors: {
              username: "Not allowed",
            },
          });
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async unauthorizeUser(_, { tripId, username }, context) {
      const user = checkAuth(context);
      try {
        const trip = await Trip.findById(tripId);
        if (user.username === trip.username) {
          const userIndex = trip.authorizedUsers.findIndex(
            (u) => u.username === username
          );
          trip.authorizedUsers.splice(userIndex, 1);
          await trip.save();
          return trip;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
