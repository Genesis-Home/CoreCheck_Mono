import pg from 'pg';
import type { DataSourceOptions } from 'typeorm';
import type { DatabaseEnv } from '../config/env.js';
import { ENTITIES } from './entities.js';
import { MIGRATIONS } from './migrations/index.js';
import { SnakeNamingStrategy } from './snake-naming.strategy.js';

// DATE columns stay as 'YYYY-MM-DD' strings. Parsing them into JavaScript
// Dates would shift them by the server's UTC offset.
const PG_DATE_OID = 1082;
pg.types.setTypeParser(PG_DATE_OID, (value: string) => value);

const sslOptions = (env: DatabaseEnv) => {
  switch (env.DATABASE_SSL) {
    case 'off':
      return false;
    case 'require':
      return { rejectUnauthorized: false };
    case 'verify':
      return { rejectUnauthorized: true, ca: env.DATABASE_CA_CERT };
  }
};

export const buildDataSourceOptions = (
  env: DatabaseEnv,
): DataSourceOptions => ({
  type: 'postgres',
  url: env.DATABASE_URL,
  ssl: sslOptions(env),
  entities: ENTITIES,
  migrations: MIGRATIONS,
  migrationsTableName: 'corecheck_migrations',
  migrationsTransactionMode: 'each',
  namingStrategy: new SnakeNamingStrategy(),
  logging: env.LOG_SQL ? ['query', 'error'] : ['error'],
  extra: {
    max: env.DATABASE_POOL_SIZE,
    application_name: 'corecheck-api',
  },
});
