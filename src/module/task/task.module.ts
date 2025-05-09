import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AppModule } from 'src/app.module';
import {DbTransactionFactory} from '../../transaction.factory'

@Module({
  imports:[
    forwardRef(() => AppModule),
  ],
  controllers: [TaskController],
  providers: [TaskService,
    DbTransactionFactory
  ]
})
export class TaskModule {}
