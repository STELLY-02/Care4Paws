const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        if (!process.env.CONNECTION_STRING) {
            throw new Error('CONNECTION_STRING is not defined in environment variables');
        }
        
        const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = dbConnect;