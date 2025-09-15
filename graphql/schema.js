const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql')
const UserType = require('./userType')
const TransferType = require('./transferType')
const { users } = require('../src/model/userModel')
const { transfers } = require('../src/model/transferModel')
const userService = require('../src/service/userService')
const transferService = require('../src/service/transferService')
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'segredo'

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return userService.getAllUsers()
      },
    },
    transfers: {
      type: new GraphQLList(TransferType),
      resolve() {
        return transferService.getTransfers()
      },
    },
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        favorecido: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        const result = userService.registerUser({ username: args.username, password: args.password, favorecido: args.favorecido })
        if (result.error) {
            throw new Error(result.error)
        }
        return result.user
      },
    },
    login: {
      type: GraphQLString,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const result = userService.loginUser({ username: args.username, password: args.password });
        if (result.error) {
            throw new Error(result.error)
        }
        return result.token
      },
    },
    transfer: {
      type: TransferType,
      args: {
        from: { type: new GraphQLNonNull(GraphQLString) },
        to: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: new GraphQLNonNull(GraphQLFloat) },
      },
      resolve(parent, args, context) {
        const authHeader = context.req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = userService.verifyToken(token);
        if (decoded.user.username != args.from) {
            throw new Error('Token inválido.')
        }
        const result = transferService.transfer({ from: args.from, to: args.to, amount: args.amount });
        if (result.error) {
            throw new Error(result.error)
        }
        return result.transfer
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
