const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = require("./app");

dotenv.config()

const PORT = process.env.PORT || 5000

async function start(){
    try {
        await mongoose.connect(
            process.env.MONGO_URI
            )

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })    
    } catch (error) {
        console.log(error);
    }
}

start()
