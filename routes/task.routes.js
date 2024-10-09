import { Router } from 'express'
import { taskController } from '../controllers/task.contoller.js';

const router=Router();


router.post("/task",taskController)

export default router;