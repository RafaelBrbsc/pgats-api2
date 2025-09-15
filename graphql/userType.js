const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    favorecido: { type: GraphQLBoolean },
    balance: { type: GraphQLFloat },
  },
});

module.exports = UserType;
