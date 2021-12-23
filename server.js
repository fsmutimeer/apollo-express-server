const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const DataLoader = require('dataloader');

const resolvers = require('./graphql/resolvers/index');
const typeDefs = require('./graphql/typeDefs/');
const { connection } = require('./database/utils/');
const { verifyUser } = require('./helper/context');
const loaders = require('./loaders')
    // set env variables
dotEnv.config();

const app = express();

//database connection
connection();


//cors
app.use(cors());

// body parser middleware
app.use(express.json());



const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({ req, connection }) => {
        const contextObj = {};
        if (req) {
            await verifyUser(req);
            contextObj.email = req.email;
            contextObj.loggedInUserId = req.loggedInUserId;
        }
        contextObj.loaders = { user: new DataLoader(keys => loaders.user.batchUser(keys)) }
        return contextObj;
    },
    formatError: (error) => {
        console.log(error);
        return { message: error.message };
    }
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;

app.use('/', (req, res, next) => {
    res.send({ message: 'Hello' });
})

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});
apolloServer.installSubscriptionHandlers(httpServer);