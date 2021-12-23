const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    task: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, {
    timestamps: true,
    // toObject: {
    //     transform: function(doc, ret, options) {
    //         delete ret.password;
    //         return ret;
    //     }
    // }
});

module.exports = mongoose.model('User', userSchema);