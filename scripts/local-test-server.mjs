// Isolated synthetic-only PostgreSQL + Next server. Never loads database credentials from .env.
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { spawnSync, spawn } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { resolve } from 'node:path';
const env = { ...process.env };
const trackingTest = process.argv.includes('--tracking');
const dbPort = trackingTest ? 55449 : 55439;
const webPort = trackingTest ? 3117 : 3107;
const pgDirectory = trackingTest ? '.local-tests/postgres-tracking' : '.local-tests/postgres';
for (const file of ['.env', '.env.local']) {
  if (existsSync(file)) for (const match of readFileSync(file, 'utf8').matchAll(/^([A-Z_][A-Z_0-9]*)=/gm)) env[match[1]] = '';
}
Object.assign(env, {
 DATABASE_URL: `postgresql://rk_test:local_synthetic_only@127.0.0.1:${dbPort}/rk_forms_test`,
 AUTH_SECRET: 'local-synthetic-test-secret-not-for-production-2026',
 NEXTAUTH_SECRET: 'local-synthetic-test-secret-not-for-production-2026',
 AUTH_URL: `http://127.0.0.1:${webPort}`, NEXTAUTH_URL: `http://127.0.0.1:${webPort}`,
 AUTH_TRUST_HOST: 'true', NEXT_TELEMETRY_DISABLED: '1',
 RK_LOCAL_DISABLE_TRACKING: process.argv.includes('--tracking') ? '0' : '1',
 RK_LOCAL_ENABLE_TRACKING: trackingTest ? '1' : '0',
 NEXT_PUBLIC_GOOGLE_ADS_LEAD_SEND_TO: '',
 RK_TRACKING_TEST: trackingTest ? '1' : '0',
 PRISMA_SCHEMA_ENGINE_BINARY: resolve('node_modules/@prisma/engines/schema-engine-windows.exe'),
 PRISMA_QUERY_ENGINE_LIBRARY: resolve('node_modules/@prisma/engines/query_engine-windows.dll.node'),
});
mkdirSync('.local-tests', {recursive:true});
const pg = new EmbeddedPostgres({databaseDir:resolve(pgDirectory),user:'rk_test',password:'local_synthetic_only',port:dbPort,persistent:true,postgresFlags:['-h','127.0.0.1'],onLog:console.log,onError:console.error});
if (!existsSync(`${pgDirectory}/PG_VERSION`)) await pg.initialise();
await pg.start();
const client = pg.getPgClient(); await client.connect();
if (!(await client.query("SELECT 1 FROM pg_database WHERE datname='rk_forms_test'")).rowCount) await pg.createDatabase('rk_forms_test');
await client.end();
const pushed=spawnSync(process.execPath,['node_modules/prisma/build/index.js','db','push','--skip-generate'],{env,stdio:'inherit'});
if (pushed.status) { await pg.stop(); process.exit(pushed.status); }
const prisma=new PrismaClient({datasourceUrl:env.DATABASE_URL});
await prisma.admin.upsert({where:{email:'test-admin@example.invalid'},create:{email:'test-admin@example.invalid',password_hash:await bcrypt.hash('TEST-local-only-2026!',10),full_name:'TEST Local Admin'},update:{}});
await prisma.$disconnect();
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port',String(webPort)],{env,stdio:'inherit'});
console.log(`LOCAL ONLY: http://127.0.0.1:${webPort}; PostgreSQL 127.0.0.1:${dbPort}/rk_forms_test`);
async function stop(){server.kill();await pg.stop();process.exit();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
server.on('exit',async(code)=>{await pg.stop();process.exit(code??0)});
