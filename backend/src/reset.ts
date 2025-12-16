import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function resetDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('Resetting database...');

    // Get the DataSource
    const dataSource = app.get(DataSource);

    // Use query runner to drop all tables
    const queryRunner = dataSource.createQueryRunner();

    // For SQLite, disable foreign key constraints before dropping tables
    await queryRunner.query('PRAGMA foreign_keys = OFF');

    // Get all table names
    const tables = await queryRunner.getTables();

    // Filter out SQLite system tables
    const systemTables = [
      'sqlite_sequence',
      'sqlite_master',
      'sqlite_temp_master',
    ];
    const userTables = tables.filter(
      (table) => !systemTables.includes(table.name),
    );

    if (userTables.length > 0) {
      // Drop all user tables
      for (const table of userTables) {
        await queryRunner.dropTable(table.name, true, true, true);
        console.log(`✓ Dropped table: ${table.name}`);
      }
    } else {
      console.log('✓ No tables to drop');
    }

    // Re-enable foreign key constraints
    await queryRunner.query('PRAGMA foreign_keys = ON');

    // Synchronize schema to recreate tables
    await dataSource.synchronize(true);
    console.log('✓ Recreated database schema');

    await queryRunner.release();

    console.log('\n✓ Database reset completed successfully!');
  } catch (error) {
    console.error('✗ Error resetting database:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

resetDatabase().catch((error) => {
  console.error('Failed to reset database:', error);
  process.exit(1);
});
