const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();
app.use(express.json());

app.use('/graphql', graphqlHTTP((req, res) => ({
  schema,
  graphiql: {
    headerEditorEnabled: true
  },
  context: { req, res },
})))

module.exports = app;
