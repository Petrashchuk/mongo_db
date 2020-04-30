const mongoose = require('mongoose');
const {Schema} = mongoose;

const FeedbackSchema = new Schema({
    value: {
        type: Boolean,
        required: true
    },
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: "Ideas"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

mongoose.model('Feedbacks', FeedbackSchema);
