const { UserInputError, AuthenticationError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
const Trip = require("../../models/Trip");

module.exports = {
  Mutation: {
    createComment: async (_, { tripId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("emty comment", {
          errors: {
            body: "comment body must not be empty",
          },
        });
      }
      const trip = await Trip.findById(tripId);
      if (trip) {
        trip.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await trip.save();
        return trip;
      } else throw new UserInputError("Post not found");
    },
    async deleteComment(_, { tripId, commentId }, context) {
        const user = checkAuth(context);
        const trip = await Trip.findById(tripId);
        if (trip){
            const index = trip.comments.findIndex(el=> el.id === commentId);
            if (trip.comments[index].username === user.username){
                trip.comments.splice(index,1)
                await trip.save();
                return trip;
            } else {
                throw new AuthenticationError('Action not allowed');
            }
           
        } else {
            throw new UserInputError('not found')
        }

    },
  },
};
