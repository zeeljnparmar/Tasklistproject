import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateTaskDto, ListTasksDto, UpdateTaskDto } from 'src/dtos/task.dto';
import { DbTransactionFactory } from 'src/transaction.factory';

@Injectable()
export class TaskService {
    constructor(
        private transactionRunner: DbTransactionFactory,
        private readonly jwtService: JwtService,
        // @InjectDataSource('user') private pdmDataSource:DataSource,
    ) { }
    async createTask(dto: CreateTaskDto) {
        if (new Date(dto.dueDate).getTime() < Date.now()) {
            throw new BadRequestException('Due date must be in the future');
        }

        let transactionRunner = null;
        try {
            transactionRunner = await this.transactionRunner.createTransaction();
            await transactionRunner.startTransaction();
            const manager = transactionRunner.transactionManager;

            const result = await manager.query(
                `
              INSERT INTO tasks (name, due_date, status, priority, date_of_creation, is_active)
              VALUES ($1, $2, $3, $4, NOW(), $5)
              RETURNING *;
              `,
                [dto.name, dto.dueDate, dto.status, dto.priority, dto.isActive ?? true]
            );

            await transactionRunner.commitTransaction();
            return result[0];
        } catch (error) {
            if (transactionRunner) await transactionRunner.rollbackTransaction();
            throw error;
        }
    }
    async updateTask(dto: UpdateTaskDto) {
        let transactionRunner = null;
        try {
            transactionRunner = await this.transactionRunner.createTransaction();
            await transactionRunner.startTransaction();
            const manager = transactionRunner.transactionManager;

            const result = await manager.query(
                `SELECT * FROM tasks WHERE id = $1`,
                [dto.taskId]
            );
            const task = result[0];
            if (!task) throw new NotFoundException('Task not found');

            const now = new Date();
            const dueDate = new Date(task.due_date);
            if (now > dueDate) {
                throw new BadRequestException('Cannot update task after its due date');
            }

            const updateQuery = `
                UPDATE tasks 
                SET name = $1, status = $2, priority = $3 
                WHERE id = $4 
                RETURNING *
              `;

            const updated = await manager.query(updateQuery, [
                dto.name,
                dto.status,
                dto.priority,
                dto.taskId,
            ]);

            await transactionRunner.commitTransaction();
            return updated[0];
        } catch (error) {
            await transactionRunner.rollbackTransaction();
            throw error;
        }
    }
    async deleteTask(dto: { taskId: number }) {
        let transactionRunner = null;
        try {
            transactionRunner = await this.transactionRunner.createTransaction();
            await transactionRunner.startTransaction();
            const manager = transactionRunner.transactionManager;

            // Check if task exists
            const result = await manager.query(`SELECT * FROM tasks WHERE id = $1`, [dto.taskId]);
            if (!result[0]) throw new NotFoundException('Task not found');

            // Delete the task
            await manager.query(`DELETE FROM tasks WHERE id = $1`, [dto.taskId]);

            await transactionRunner.commitTransaction();
            return { message: 'Task deleted successfully' };
        } catch (err) {
            await transactionRunner.rollbackTransaction();
            throw err;
        }
    }
    async listTasks(dto: ListTasksDto) {
        let transactionRunner = null;
        try {
            transactionRunner = await this.transactionRunner.createTransaction();
            await transactionRunner.startTransaction();
            const manager = transactionRunner.transactionManager;

            // Prepare the SQL query
            let query = `SELECT * FROM tasks WHERE 1 = 1`;
            const params = [];

            if (dto.status) {
                query += ` AND status = $${params.length + 1}`;
                params.push(dto.status);
            }

            if (dto.priority) {
                query += ` AND priority = $${params.length + 1}`;
                params.push(dto.priority);
            }

            if (dto.isActive !== undefined) {
                query += ` AND is_active = $${params.length + 1}`;
                params.push(dto.isActive);
            }

            if (dto.search) {
                query += ` AND LOWER(name) LIKE LOWER($${params.length + 1})`;
                params.push(`%${dto.search}%`);
            }

            // Pagination logic
            query += ` ORDER BY id ASC`;
            query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(dto.limit);
            params.push((dto.page - 1) * dto.limit);

            const tasks = await manager.query(query, params);

            // Count total tasks for pagination
            const totalCountResult = await manager.query(`SELECT COUNT(*) FROM tasks WHERE 1 = 1`, []);
            const totalCount = parseInt(totalCountResult[0].count, 10);

            // Calculate total pages
            const totalPages = Math.ceil(totalCount / dto.limit);

            await transactionRunner.commitTransaction();

            return {
                data: tasks,
                pagination: {
                    currentPage: dto.page,
                    totalPages,
                    totalCount,
                    limit: dto.limit,
                },
            };
        } catch (err) {
            await transactionRunner.rollbackTransaction();
            throw err;
        }
    }
    async fetchTask(id: number) {
        let transactionRunner = null;
        try {
            transactionRunner = await this.transactionRunner.createTransaction();
            await transactionRunner.startTransaction();
            const manager = transactionRunner.transactionManager;

            // SQL query to fetch a task by its ID
            const query = `SELECT * FROM tasks WHERE id = $1 LIMIT 1`;
            const params = [id];

            // Executing query
            const task = await manager.query(query, params);

            if (!task || task.length === 0) {
                throw new Error('Task not found');
            }

            await transactionRunner.commitTransaction();

            return task[0]; // Return the first (and only) task
        } catch (err) {
            await transactionRunner.rollbackTransaction();
            throw err;
        }
    }
}
