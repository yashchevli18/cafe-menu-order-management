import os from 'node:os';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const DEV_PORT = 5173;
const VIRTUAL_ADAPTER = /vmware|virtualbox|vbox|hyper-v|vethernet|wsl|docker|loopback|tailscale|zerotier/i;

const getLanAddress = () => {
  const candidates = Object.entries(os.networkInterfaces()).flatMap(([name, addresses]) =>
    (addresses ?? [])
      .filter((entry) => entry.family === 'IPv4' && !entry.internal && !entry.address.startsWith('169.254.'))
      .map((entry) => ({ name, address: entry.address })),
  );
  const physical = candidates.filter(
    (candidate) => !VIRTUAL_ADAPTER.test(candidate.name) && !candidate.address.startsWith('192.168.56.'),
  );
  const preferred = physical.find((candidate) => /wi-?fi|wlan|wireless/i.test(candidate.name)) ?? physical[0];
  return (preferred ?? candidates[0])?.address ?? '';
};

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.DEV_API_PROXY_TARGET || 'http://localhost:5000';
  const lanAddress = command === 'serve' ? getLanAddress() : '';

  const proxy = {
    '/api': { target: apiProxyTarget, changeOrigin: true, xfwd: true },
  };

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __DEV_LAN_ORIGIN__: JSON.stringify(lanAddress ? `http://${lanAddress}:${DEV_PORT}` : ''),
    },
    server: {
      host: true,
      port: DEV_PORT,
      proxy,
    },
    preview: {
      host: true,
      port: 4173,
      proxy,
    },
  };
});
