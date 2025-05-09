import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from '@nestjs/typeorm'
import { DB_HOST, DB_NAME, DB_PORT, PASSWORD, USER } from 'env.constants'


export const Users:TypeOrmModuleOptions={
  type: 'postgres',
  host: String(DB_HOST),
  port: 5432,
  username: String(USER),
  password: String(PASSWORD),
  database: String(DB_NAME),
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
}