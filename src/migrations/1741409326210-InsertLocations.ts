import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertLocations1741409326210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO locations (id, name, address, organization_id, created_at, updated_at) VALUES
          (1, 'TechCorp HQ', '123 Silicon Valley, CA', 1, NOW(), NOW()),
          (2, 'MediCare Center', '456 Medical Street, NY', 2, NOW(), NOW()),
          (3, 'EduSmart Campus', '789 Learning Ave, TX', 3, NOW(), NOW());
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM locations WHERE id IN (1, 2, 3);`);

    // Reset sequence để tránh ID nhảy số sau khi rollback
    await queryRunner.query(`ALTER SEQUENCE locations_id_seq RESTART WITH 1;`);
  }
}
