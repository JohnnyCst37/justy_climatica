import appMod from '../dist-server/app.cjs';

let cachedApp = null;

function resolveApp() {
  if (cachedApp) return cachedApp;
  const factory = appMod?.createApiApp || appMod?.default?.createApiApp;
  if (typeof factory !== 'function') {
    throw new Error('createApiApp_not_found');
  }
  cachedApp = factory();
  return cachedApp;
}

export default function handler(req, res) {
  try {
    const app = resolveApp();
    return app(req, res);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Falha ao inicializar API serverless.', detail }));
  }
}
