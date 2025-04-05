import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dbName: process.env.DATABASE_NAME,
}));
