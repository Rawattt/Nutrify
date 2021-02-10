const mongoose = require('mongoose');

const URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.glwj2.mongodb.net/nutrify?retryWrites=true&w=majority`;

const connectDB = async () => {
    const conn = await mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        autoIndex: true
    });
    console.log(`Mongodb connected: ${conn.connection.host}`);
};

module.exports = connectDB;
