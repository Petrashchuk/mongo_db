const mongoose = require('mongoose');
const {Schema} = mongoose;

const IdeaSchema = new Schema({
    description: String,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    feedbacks: [{
        type: Schema.Types.ObjectId,
        ref: "Feedbacks"
    }]
});

mongoose.model('Ideas', IdeaSchema);
