import TcpSocket from 'react-native-tcp-socket';
import { Message } from '@types/index';

const DEFAULT_PORT = 8988;

export class TcpSocketService {
  private static server: any = null;
  private static sockets: Map<string, any> = new Map();
  private static listeners: Array<(m: Message) => void> = [];

  static startServer(onReady?: (port: number) => void) {
    if (TcpSocketService.server) return;
    const server = TcpSocket.createServer((socket) => {
      const key = `${socket.remoteAddress}:${socket.remotePort}`;
      TcpSocketService.sockets.set(key, socket);

      socket.on('data', (data: Buffer | string) => {
        try {
          const text = typeof data === 'string' ? data : data.toString('utf8');
          const chunks = text.split('\n').filter(Boolean);
          for (const c of chunks) {
            const msg = JSON.parse(c) as Message;
            TcpSocketService.listeners.forEach((l) => l(msg));
          }
        } catch {}
      });

      socket.on('error', () => {
        TcpSocketService.sockets.delete(key);
      });
      socket.on('close', () => {
        TcpSocketService.sockets.delete(key);
      });
    });

    server.listen({ port: DEFAULT_PORT, host: '0.0.0.0' }, () => {
      onReady?.(DEFAULT_PORT);
    });

    TcpSocketService.server = server;
  }

  static stopServer() {
    TcpSocketService.server?.close();
    TcpSocketService.server = null;
    TcpSocketService.sockets.forEach((s) => s.destroy());
    TcpSocketService.sockets.clear();
  }

  static onMessage(cb: (m: Message) => void) {
    TcpSocketService.listeners.push(cb);
    return () => {
      TcpSocketService.listeners = TcpSocketService.listeners.filter(
        (x) => x !== cb
      );
    };
  }

  static async send(
    host: string,
    msg: Message,
    port = DEFAULT_PORT
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = TcpSocket.createConnection({ port, host }, () => {
        client.write(JSON.stringify(msg) + '\n');
        client.destroy();
        resolve();
      });
      client.on('error', (e: Error) => reject(e));
      setTimeout(() => reject(new Error('timeout')), 5000);
    });
  }
}
