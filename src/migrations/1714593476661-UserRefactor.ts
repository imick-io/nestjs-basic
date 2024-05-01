import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactor1714593476661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add column role
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'basic'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN role`);
  }
}
