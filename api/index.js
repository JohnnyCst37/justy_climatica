import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createApiApp } = require('../dist-server/app.cjs');
const app = createApiApp();

export default app;
