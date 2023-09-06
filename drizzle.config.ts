import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import pc from 'picocolors';

if (!process.env.DB_URL) throw Error('Missing DB_URL');

console.log(
  `DB_URL: ${process.env.DB_URL.slice(0, 25)}${pc.dim('*'.repeat(process.env.DB_URL.length - 25))}`
);

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
} satisfies Config;
