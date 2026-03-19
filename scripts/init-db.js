#!/usr/bin/env node
/**
 * Seed the database with some starter categories.
 * Run: node scripts/init-db.js
 */
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';

const DATA_DIR = process.env.DATA_DIR || './data';
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(`${DATA_DIR}/blockparty.db`);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    max_slots INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_info TEXT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    notes TEXT,
    honeypot TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const existing = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (existing.count > 0) {
  console.log('Database already has categories, skipping seed.');
  process.exit(0);
}

const insert = db.prepare(
  'INSERT INTO categories (name, max_slots, description) VALUES (?, ?, ?)'
);

const categories = [
  ['Main Dish', 3, 'Grillable or oven-ready entrée'],
  ['Side Dish', 4, 'Salads, vegetables, pasta sides'],
  ['Appetizer / Snacks', 3, 'Chips, dips, finger foods'],
  ['Dessert', 3, 'Cookies, brownies, cake, etc.'],
  ['Drinks / Beverages', 2, 'Lemonade, water, soda, etc.'],
  ['Paper Goods / Utensils', 1, 'Plates, cups, napkins, silverware'],
  ['Ice / Cooler', 1, 'Bags of ice and/or a cooler'],
  ['Lawn Game', 2, 'Cornhole, bocce, frisbee, etc.'],
];

for (const [name, max_slots, description] of categories) {
  insert.run(name, max_slots, description);
}

console.log(`Seeded ${categories.length} categories.`);
db.close();
