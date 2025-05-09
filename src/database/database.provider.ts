import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from '@nestjs/typeorm'
import { DB_HOST, DB_NAME, DB_PORT, PASSWORD, USER } from 'env.constants'


export const Users:TypeOrmModuleOptions={
    name:'user',
    type:'postgres',
    host:DB_HOST,
    port:parseInt(DB_PORT),
    username : String(USER),
    password: String(PASSWORD),
    database : String(DB_NAME),
    synchronize:true,
    logging:true,
    entities: ["dist/**/*.entity{.ts,.js}"],
}