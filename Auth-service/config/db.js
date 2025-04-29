const mongoose = require('mongoose');
require ('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Mongodb connection error:', err);
});

module.exports = mongoose;