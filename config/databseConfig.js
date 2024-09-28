

const mongoose = require('mongoose');

const   connectDatabase  =  async ()=>{

    try {

        const   connected =   mongoose.connect(process.env.MONGO_STRING )
        console.log(`Database   connection established  on ${connected.host}`)

    } catch (error) {

        console.log({

            message: `error  connecting  to  database ${error}`

        })
        
    }
}

module.exports  =   connectDatabase;