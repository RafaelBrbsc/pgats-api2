const { GraphQLObjectType, GraphQLString, GraphQLFloat } = require('graphql');

const TransferType = new GraphQLObjectType({
  name: 'Transfer',
  fields: {
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    date: { type: GraphQLString },
  },
});

module.exports = TransferType;
