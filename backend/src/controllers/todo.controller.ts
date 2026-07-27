import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';

export class TodoController {
  private service: TodoService;

  constructor(service: TodoService = new TodoService()) {
    this.service = service;
  }

  getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        search,
        status,
        priority,
        category,
        sortBy,
        order,
        page,
        limit,
      } = req.query;

      const result = await this.service.getAllTodos({
        search: search ? String(search) : undefined,
        status: status ? (String(status) as any) : undefined,
        priority: priority ? (String(priority) as any) : undefined,
        category: category ? String(category) : undefined,
        sortBy: sortBy ? (String(sortBy) as any) : undefined,
        order: order ? (String(order) as any) : undefined,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 10,
      });

      res.status(200).json({
        success: true,
        data: result.todos,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: limit ? parseInt(String(limit), 10) : 10,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.getTodoById(id);
      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todo = await this.service.createTodo(req.body);
      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await this.service.updateTodo(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTodoStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const todo = await this.service.updateTodoStatus(id, status);
      res.status(200).json({
        success: true,
        message: `Todo status changed to '${status}'`,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.service.deleteTodo(id);
      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  addSubtask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;
      const subtask = await this.service.addSubtask(id, title, completed);
      res.status(201).json({
        success: true,
        message: 'Subtask added successfully',
        data: subtask,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSubtask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subtaskId } = req.params;
      const { title, completed } = req.body;
      const subtask = await this.service.updateSubtask(subtaskId, title, completed);
      res.status(200).json({
        success: true,
        message: 'Subtask updated successfully',
        data: subtask,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSubtask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subtaskId } = req.params;
      const result = await this.service.deleteSubtask(subtaskId);
      res.status(200).json({
        success: true,
        message: 'Subtask deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getSummaryStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.service.getSummaryStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
