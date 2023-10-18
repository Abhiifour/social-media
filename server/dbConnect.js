const mongoose = require("mongoose");

module.exports = async() => {
  const mongoUri =
    "mongodb+srv://abhiifour:yeahabhi4@cluster0.h5lg4zu.mongodb.net/";
    try {
        const connect = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected : ${connect.connection.host}`);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
 
};
