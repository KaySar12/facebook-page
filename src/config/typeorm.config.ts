import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'admin',
  password: 'admin',
  database: 'SocialPage',
  options: {
    encrypt: false,
  },
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false,
};

