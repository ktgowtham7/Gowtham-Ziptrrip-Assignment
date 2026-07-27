import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createSubtaskSchema,
  createTodoSchema,
  updateStatusSchema,
  updateSubtaskSchema,
  updateTodoSchema,
} from '../schemas/todo.schema';

const router = Router();
const controller = new TodoController();

// Statistics route (place before /:id)
router.get('/stats/summary', controller.getSummaryStats);

// Main Todo CRUD routes
router.get('/', controller.getTodos);
router.get('/:id', controller.getTodoById);
router.post('/', validateRequest(createTodoSchema), controller.createTodo);
router.put('/:id', validateRequest(updateTodoSchema), controller.updateTodo);
router.patch('/:id/status', validateRequest(updateStatusSchema), controller.updateTodoStatus);
router.delete('/:id', controller.deleteTodo);

// Subtask management routes
router.post('/:id/subtasks', validateRequest(createSubtaskSchema), controller.addSubtask);
router.patch('/subtasks/:subtaskId', validateRequest(updateSubtaskSchema), controller.updateSubtask);
router.delete('/subtasks/:subtaskId', controller.deleteSubtask);

export default router;
