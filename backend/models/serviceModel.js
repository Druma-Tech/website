const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscription: {
        type: String,
        required: true,
    },
    subscriptionDetails: {
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
    },
    servicesUsed: {
        type: Map,
        of: Number,
        default: {},
    },
    totalCost: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Service', serviceSchema);
