import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Convitcon12',
  database: 'trading-stock',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};

// export const databaseConfig: PostgresConnectionOptions = {
//   type: 'postgres',
//   host: dbConfig.host,
//   port: dbConfig.port,
//   username: dbConfig.username,
//   password: dbConfig.password,
//   database: dbConfig.database,
//   entities: [__dirname + '/../**/*.entity.{ts,js}'],
//   synchronize: false,
//   migrations: [__dirname + '/migrations/*.{js,ts}'],
//   subscribers: [__dirname + '/subscribers/*.{js,ts}'],
//   migrationsRun: true,
//   connectTimeoutMS: 10000, // 10 seconds
// };
// export const dataSource = new DataSource(databaseConfig);
