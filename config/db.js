const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/BugLogger', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        console.log("MongoDB connected")
    } catch (err) {
        console.log(err);
        process.exit(1)
    }

}

module.exports = connectDB