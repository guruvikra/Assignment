import {taskQueue} from '../utils/bullMq.js'
import { limiter,rateLimitPerMin,rateLimitPerSec } from '../middlewares/rateLimiter.middleware.js'
import { logTaskCompletion } from '../utils/logger.js';

export const taskController = async (req ,res) => {
    try {
      const {user_id} =req.body;
      console.log(process.cwd())

      if(!user_id) return res.status(404).json({msg:"user_id is required"})
      await rateLimitPerSec.consume(user_id)
      await rateLimitPerMin.consume(user_id)
      
      // await redisClient.rPush('task',JSON.stringify({user_id,timeStamp:new Date(Date.now()).toISOString()}))

      await taskQueue.add('task',{
          user_id:user_id,
          timeStamp: new Date().toISOString()
      })
      
      await logTaskCompletion(user_id)

      return res.json({ msg: `Hello World from ${process.pid} ` });
    }
     catch (error) {
      if (error instanceof Error) {
          return res.status(500).json({ msg: 'Internal Server Error' });
      }

      if(error.msBeforeNext>0){
          return res.status(401).json({
              msg: `Too Many Requests. Try again in 60 seconds.`,
          });
      }

    }

  }