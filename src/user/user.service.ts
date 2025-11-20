import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../config/cache.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  private mockUsersPath = path.join(process.cwd(), 'src', 'mock-users.json');

  constructor(private cacheService: CacheService) {}

  private readMockUsers(): Record<string, any> {
    const data = fs.readFileSync(this.mockUsersPath, 'utf-8');
    return JSON.parse(data);
  }

  private writeMockUsers(users: Record<string, any>): void {
    fs.writeFileSync(this.mockUsersPath, JSON.stringify(users, null, 2));
  }

  async getUser(id: string) {
    const cached = this.cacheService.get(`user:${id}`);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 200));
    const mockUsers = this.readMockUsers();
    const user = mockUsers[id];
    if (!user) throw new NotFoundException('User not found');

    this.cacheService.set(`user:${id}`, user);
    return user;
  }

  createUser(userData: { name: string; email: string }) {
    const mockUsers = this.readMockUsers();
    const id = String(Object.keys(mockUsers).length + 1);
    const user = { id: parseInt(id), ...userData };
    mockUsers[id] = user;
    this.writeMockUsers(mockUsers);
    return user;
  }

  clearCache() {
    this.cacheService.clear();
    return { message: 'Cache cleared' };
  }

  getCacheStatus() {
    return this.cacheService.getStats();
  }
}