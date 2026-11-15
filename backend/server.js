import env, { assertRequiredEnv } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import app from './app.js';

let server;

const shutdown = (signal, exitCode = 0) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  const forceExit = setTimeout(() => process.exit(exitCode || 1), 10000);
  forceExit.unref();

  const close = server ? new Promise((resolve) => server.close(resolve)) : Promise.resolve();
  close
    .then(() => disconnectDB())
    .catch((error) => console.error('Error during shutdown:', error.message))
    .finally(() => process.exit(exitCode));
};

const startServer = async () => {
  try {
    assertRequiredEnv();
    await connectDB();

    server = app.listen(env.port, () => {
      console.log(`Brew & Bean API running in ${env.nodeEnv} mode on port ${env.port}`);
      console.log(`API docs: http://localhost:${env.port}/api/docs`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${env.port} is already in use, probably by another backend instance that is still running.\n` +
            `  Stop the other instance (close its terminal or press Ctrl+C there), or free the port:\n` +
            `    Windows PowerShell: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${env.port} -State Listen).OwningProcess\n` +
            `    macOS/Linux:        kill $(lsof -t -i:${env.port})\n` +
            `  Or set a different PORT in backend/.env (and update DEV_API_PROXY_TARGET in frontend/.env).`,
        );
      } else {
        console.error('Server error:', error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdown('uncaughtException', 1);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
