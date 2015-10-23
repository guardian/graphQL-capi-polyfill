/* @flow */

var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphqlSchema = require('./schema.js');

var app = express();

app.use('/', graphqlHTTP({ schema: graphqlSchema, graphiql: true }));


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
