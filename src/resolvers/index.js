const Query = require('./query');
const Mutation = require('./mutation');
const Note = require('./note');
const User = require('./user');
// graphql-iso-Date 패키지 -> graphql-scalars로 migration(패키지 버전 충돌 문제)
const { GraphQLDateTime } = require('graphql-scalars');

module.exports = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime,
};
