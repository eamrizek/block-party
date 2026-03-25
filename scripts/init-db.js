#!/usr/bin/env node
/**
 * Initialize and seed the database with potluck categories.
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

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
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
  ['Beans',               3, 'For 30 people per sign-up'],
  ['Chips',               3, 'For 30 people per sign-up'],
  ['Clean-up Volunteer',  8, null],
  ['Dessert',             5, 'Cookies, brownies, popsicles, etc; For 20 people per sign-up'],
  ['Fruit',               4, 'For 15 people per sign-up'],
  ['Guacamole',           3, 'For 15 people per sign-up'],
  ['Mexican-style beers', 4, null],
  ['Non-alcoholic drinks',3, 'Bubbly waters, soda, juice boxes, etc'],
  ['Other Beers',         2, null],
  ['Rice',                4, 'For 20 people per sign-up'],
  ['Salad',               2, 'For 20 people per sign-up'],
  ['Salsa',               4, 'For 15 people per sign-up'],
  ['Setup Volunteer',     8, null],
  ['Sliced Limes',        4, 'For tacos or beer; 10 sliced limes per sign-up'],
  ['Water Bottles',       2, 'For 50 people per sign-up'],
];

for (const [name, max_slots, description] of categories) {
  insert.run(name, max_slots, description);
}

console.log(`Seeded ${categories.length} categories.`);
db.close();
