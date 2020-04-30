const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    ideas: [{
        type: Schema.Types.ObjectId,
        ref: "Ideas",
        default: []
    }]
});

mongoose.model('Users', UserSchema);

