const { skip } = require('graphql-resolvers');
const Task = require('../../database/models/Task');
const { isValidObjectId } = require('../../database/utils')

module.exports.isAuthenticated = async(_, __, { email }) => {
    if (!email) {
        throw new Error("not authenticated")
    }
    return skip;
}

module.exports.isTaskOwner = async(_, { id }, { loggedInUserId }) => {
    try {
        isValidObjectId(id, 'task')
        const task = await Task.findById(id);
        if (!task) {
            throw new Error('Task not found');
        } else if (task.user.toString() !== loggedInUserId) {
            throw new Error('Un authorized');
        }
        return skip;

    } catch (error) {
        console.log(error);
        throw error;
    }
}