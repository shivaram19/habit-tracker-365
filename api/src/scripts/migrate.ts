import pool from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    console.log('Running database migrations...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        divider_position INTEGER DEFAULT 50,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS days (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        hourly_logs INTEGER[] DEFAULT ARRAY_FILL(-1, ARRAY[24]),
        total_spend NUMERIC(10,2) DEFAULT 0,
        highlight TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, date)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS list_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_days_user_id ON days(user_id);
      CREATE INDEX IF NOT EXISTS idx_days_date ON days(date);
      CREATE INDEX IF NOT EXISTS idx_list_items_user_id ON list_items(user_id);
      CREATE INDEX IF NOT EXISTS idx_list_items_day_id ON list_items(day_id);
      CREATE INDEX IF NOT EXISTS idx_list_items_date ON list_items(date);
    `);

    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
