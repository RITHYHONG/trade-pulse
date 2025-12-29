import { onRequest } from 'firebase-functions/v2/https';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, conf: { distDir: '../../.next' } });
const handle = nextApp.getRequestHandler();

export const nextjsFunc = onRequest(async (req, res) => {
  await nextApp.prepare();
  return handle(req, res);
});
