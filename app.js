import express from 'express'
import  cluster from 'node:cluster'
import dotenv from  'dotenv'
import {Worker} from "bullmq"
import { taskController } from './controllers/task.contoller.js'
import taskrouter from './routes/task.routes.js'
 

dotenv.config()
// const totalcore=os.availableParallelism()
// console.log(totalcore);

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
    const app= express()
    app.use(express.json())


    app.use(taskrouter)


    const worker = new Worker('taskQueue', async job => {
        const { user_id } = job.data; // Destructure userId and timestamp
    
        console.log(`Processing task for user ID: ${user_id}`);
        
        // Simulate task processing time (e.g., 1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`Task completed for user ID: ${user_id}`);
    }, { 
        connection: { 
            host: 'localhost', 
            port: 6379 
        } 
    });

    
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}  on worker ${process.pid}`)
    })
}

