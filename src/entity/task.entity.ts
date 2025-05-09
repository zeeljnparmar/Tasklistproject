import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column()
  status: string;

  @Column()
  priority: string;

  @CreateDateColumn({ name: 'date_of_creation' })
  dateOfCreation: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}