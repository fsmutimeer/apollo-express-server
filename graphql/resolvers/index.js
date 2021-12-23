const { GraphQLDateTime } = require('graphql-iso-date');
const userResolver = require('./userResolver');
const taskResolver = require('./taskResolver');
const customDateScalarResolver = {
    Date: GraphQLDateTime
}

module.exports = [
    userResolver,
    taskResolver,
    customDateScalarResolver
];