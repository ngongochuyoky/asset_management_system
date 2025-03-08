import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAssets1741409363618 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              INSERT INTO assets (id, type, serial, status, description, location_id, created_at, updated_at) VALUES
              (1, 'Laptop', 'SN123456', 'active', 'MacBook Pro 16-inch', 1, NOW(), NOW()),
              (2, 'MRI Scanner', 'SN789101', 'active', 'High-end medical scanner', 2, NOW(), NOW()),
              (3, 'Smartboard', 'SN112233', 'inactive', 'Interactive smartboard', 3, NOW(), NOW());
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM assets WHERE id IN (1, 2, 3);`);

    // Reset sequence để tránh ID bị nhảy số sau khi rollback
    await queryRunner.query(`ALTER SEQUENCE assets_id_seq RESTART WITH 1;`);
  }
}
