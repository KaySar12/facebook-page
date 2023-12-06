import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Convitcon12',
  database: 'FacebookPage',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};

