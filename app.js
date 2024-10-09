import express from 'express'
import  cluster from 'node:cluster'
import dotenv from  'dotenv'
import {Worker} from "bullmq"
import taskrouter from './routes/task.routes.js'
 


//i have used the prodcution level file which i learnt from hitesh choudary on youtube 


// Here we are implenting out env variables using dotenv package
dotenv.config()
// const totalcore=os.availableParallelism()
// console.log(totalcore);


//Here we are checking weather the server is main ,if not main then we are creating a main server then the replicate of the instance

const replicaset = 2;
if(cluster.isPrimary){

    for(let i=0; i<replicaset; i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
}
else{

    // Create a new express app and configure it with middleware, routes, and other settings.
    const app= express()
    app.use(express.json())
    app.use(taskrouter)


    //worker it is used to process with the things inside of the queue we added 
    // This worker will consume jobs from the 'taskQueue' queue and process them.
    const worker = new Worker('taskQueue', async job => {
        const { user_id } = job.data; // Destructure userId and timestamp
        console.log(`Processing task for user ID: ${user_id}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Task completed for user ID: ${user_id}`);
    }, { 
        connection: { 
            host: 'localhost', 
            port: 6379 
        } 
    });


    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}

