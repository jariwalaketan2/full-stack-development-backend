import { Injectable } from '@nestjs/common';

interface QueueItem {
  id: string;
  resolve: (data: any) => void;
  reject: (error: any) => void;
}

@Injectable()
export class QueueService {
  private processing = new Map<string, Promise<any>>();
  private queue: QueueItem[] = [];

  async processRequest<T>(id: string, processor: () => Promise<T>): Promise<T> {
    if (this.processing.has(id)) {
      return this.processing.get(id);
    }

    const promise = new Promise<T>((resolve, reject) => {
      this.queue.push({ id, resolve, reject });
      this.processNext();
    });

    this.processing.set(id, promise);
    return promise;
  }

  private async processNext(): Promise<void> {
    if (this.queue.length === 0) return;

    const item = this.queue.shift()!;
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate DB delay
      const mockUsers: Record<string, any> = {
        '1': { id: 1, name: 'John Doe', email: 'john@example.com' },
        '2': { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        '3': { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
      };

      const user = mockUsers[item.id];

      if (!user) {
        item.reject(new Error('User not found'));
      } else {
        item.resolve(user);
      }

    } catch (error) {
      item.reject(error);
    } finally {
      this.processing.delete(item.id);
    }
  }
}