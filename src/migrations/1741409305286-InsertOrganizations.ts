import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertOrganizations1741409305286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO organizations (id, name, description, created_at, updated_at) VALUES
          (1, 'TechCorp', 'Technology solutions provider', NOW(), NOW()),
          (2, 'MediCare', 'Healthcare equipment supplier', NOW(), NOW()),
          (3, 'EduSmart', 'Smart education systems', NOW(), NOW());
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM organizations WHERE id IN (1, 2, 3);`);

    // Reset sequence để đảm bảo ID bắt đầu lại từ 1 khi migration bị rollback
    await queryRunner.query(
      `ALTER SEQUENCE organizations_id_seq RESTART WITH 1;`,
    );
  }
}
