const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

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
