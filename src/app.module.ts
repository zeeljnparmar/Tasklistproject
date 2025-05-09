import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {Users} from './database/database.provider'
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './module/task/task.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TaskModule,
    JwtModule.register({
      global: true,
      secret: 'greeka',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot({...Users,name:"user"})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
