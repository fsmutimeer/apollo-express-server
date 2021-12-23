const mongoose = require('mongoose');
require('dotenv/config')
module.exports.connection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected...')
    } catch (error) {
        console.log(error);
        throw error;
    }

}

module.exports.isValidObjectId = (id, name) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${name} id`)
    }
}