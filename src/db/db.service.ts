import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@Inject('Connection') public connection: Connection) {}
  public async getRepository<T>(entity: any): Promise<Repository<any>> {
    return this.connection.getRepository(entity);
  }
}
