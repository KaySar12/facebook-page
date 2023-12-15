import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  url: 'postgresql://postgres:BAaB31CedfB-3dACc5GFedG5-2dd6e-f@monorail.proxy.rlwy.net:14225/railway',
  type: 'postgres',
  host: 'monorail.proxy.rlwy.net',
  port: 14225,
  username: 'postgres',
  password: 'BAaB31CedfB-3dACc5GFedG5-2dd6e-f',
  database: 'railway',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};

