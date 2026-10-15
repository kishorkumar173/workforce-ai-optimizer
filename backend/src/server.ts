import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`============================================================`);
  console.log(`🚀 TeamPulse Intelligence Backend running on port ${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`✨ Supabase Mode: ${config.supabase.isConfigured ? 'Connected to Cloud' : 'Seamless In-Memory / Seed Mode'}`);
  console.log(`============================================================`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
