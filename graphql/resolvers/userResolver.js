const bcrypt = require('bcryptjs');
const { combineResolvers } = require('graphql-resolvers')
const User = require('../../database/models/User');
const Task = require('../../database/models/Task')
const { isAuthenticated } = require('../middleware');
const PubSub = require('../subscription');
const { userEvents } = require('../subscription/events')
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();
module.exports = {
    //query
    Query: {

        user: combineResolvers(isAuthenticated, async(_, __, { email }) => {

            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('User not found')
                }
                return user

            } catch (error) {
                console.log(error)
                throw new Error(error)

            }


        })
    },
    //mutation
    Mutation: {
        signup: async(_, { input }) => {

            try {
                const user = await User.findOne({ email: input.email });
                if (user) {
                    throw new Error('Email Already in use!!!')
                }
                const password = await bcrypt.hash(input.password, 10);

                const newUser = new User({
                    ...input,
                    password: password
                });

                const result = await newUser.save();
                PubSub.publish(userEvents.USER_CREATED, {
                    userCreated: result
                })
                return result;

            } catch (error) {
                console.log(error);
                throw error;
            }

        },
        login: async(_, { input }) => {
            try {
                const user = await User.findOne({ email: input.email });
                if (!user) {
                    throw new Error('invalid credentialss');
                }
                const validuser = await bcrypt.compare(input.password, user.password);
                if (!validuser) {
                    throw new Error('invalid credentials')
                }
                const SECRET = process.env.SECRET || 'hellobabe'
                const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' })
                return { token }

            } catch (error) {
                console.log(error);
                throw error;
            }

        }
    },
    Subscription: {
        userCreated: {
            subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
        }

    },
    //field level reslover
    User: {
        task: async({ id }) => {
            try {
                const task = await Task.find({ user: id });
                return task;

            } catch (error) {
                console.log(error);
                throw new Error(error);
            }

        }
    }
}