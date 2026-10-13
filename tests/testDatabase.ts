// Fixed loopback databases only. Never use DATABASE_URL from the developer's .env.
export const testDatabaseUrl = `postgresql://rk_test:local_synthetic_only@127.0.0.1:${process.env.RK_TRACKING_TEST === '1' ? 55449 : 55439}/rk_forms_test`
