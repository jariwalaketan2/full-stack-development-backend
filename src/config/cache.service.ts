import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

@Injectable()
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly MAX_SIZE = 1000;
  private hits = 0;
  private misses = 0;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }
    entry.accessCount++;
    this.hits++;
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    if (this.cache.size >= this.MAX_SIZE) {
      this.evictLRU();
    }
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
    });
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits / (this.hits + this.misses) || 0,
    };
  }



  private evictLRU(): void {
    let lruKey = '';
    let lruAccess = Infinity;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < lruAccess) {
        lruAccess = entry.accessCount;
        lruKey = key;
      }
    }
    if (lruKey) this.cache.delete(lruKey);
  }
}