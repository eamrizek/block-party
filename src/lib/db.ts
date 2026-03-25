import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = process.env.DATA_DIR || './data';

if (!existsSync(DATA_DIR)) {
	mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = join(DATA_DIR, 'blockparty.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
	if (_db) return _db;

	_db = new Database(DB_PATH);
	_db.pragma('journal_mode = WAL');
	_db.pragma('foreign_keys = ON');

	_db.exec(`
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
			parent_id INTEGER REFERENCES comments(id),
			honeypot TEXT,
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);

	// Migration: add parent_id to existing comments tables that predate this column
	try {
		_db.exec(`ALTER TABLE comments ADD COLUMN parent_id INTEGER REFERENCES comments(id)`);
	} catch {
		// Column already exists, nothing to do
	}

	return _db;
}

export type Category = {
	id: number;
	name: string;
	max_slots: number;
	description: string | null;
	created_at: string;
	signup_count: number;
};

export type Signup = {
	id: number;
	name: string;
	contact_info: string | null;
	category_id: number;
	notes: string | null;
	created_at: string;
	category_name?: string;
};

export function getCategories(): Category[] {
	const db = getDb();
	return db.prepare(`
		SELECT c.*, COUNT(s.id) as signup_count
		FROM categories c
		LEFT JOIN signups s ON s.category_id = c.id
		GROUP BY c.id
		ORDER BY c.name ASC
	`).all() as Category[];
}

export function getCategoryById(id: number): Category | undefined {
	const db = getDb();
	return db.prepare(`
		SELECT c.*, COUNT(s.id) as signup_count
		FROM categories c
		LEFT JOIN signups s ON s.category_id = c.id
		WHERE c.id = ?
		GROUP BY c.id
	`).get(id) as Category | undefined;
}

export function createCategory(name: string, max_slots: number, description: string | null) {
	const db = getDb();
	return db.prepare(`
		INSERT INTO categories (name, max_slots, description) VALUES (?, ?, ?)
	`).run(name, max_slots, description);
}

export function updateCategory(id: number, name: string, max_slots: number, description: string | null) {
	const db = getDb();
	return db.prepare(`
		UPDATE categories SET name = ?, max_slots = ?, description = ? WHERE id = ?
	`).run(name, max_slots, description, id);
}

export function deleteCategory(id: number) {
	const db = getDb();
	return db.prepare(`DELETE FROM categories WHERE id = ?`).run(id);
}

export function getSignups(): Signup[] {
	const db = getDb();
	return db.prepare(`
		SELECT s.*, c.name as category_name
		FROM signups s
		JOIN categories c ON c.id = s.category_id
		ORDER BY s.created_at DESC
	`).all() as Signup[];
}

export type Comment = {
	id: number;
	name: string;
	message: string;
	parent_id: number | null;
	created_at: string;
	replies?: Comment[];
};

export function getComments(): Comment[] {
	const db = getDb();
	const all = db.prepare(`
		SELECT id, name, message, parent_id, created_at
		FROM comments
		ORDER BY created_at ASC
	`).all() as Comment[];

	// Nest replies under their parent
	const top: Comment[] = [];
	const byId = new Map<number, Comment>();
	for (const c of all) {
		c.replies = [];
		byId.set(c.id, c);
	}
	for (const c of all) {
		if (c.parent_id && byId.has(c.parent_id)) {
			byId.get(c.parent_id)!.replies!.push(c);
		} else {
			top.push(c);
		}
	}
	return top.reverse(); // newest top-level first
}

export function createComment(name: string, message: string, parent_id: number | null = null) {
	const db = getDb();
	return db.prepare(`INSERT INTO comments (name, message, parent_id) VALUES (?, ?, ?)`).run(name, message, parent_id);
}

export function createSignup(
	name: string,
	contact_info: string | null,
	category_id: number,
	notes: string | null
) {
	const db = getDb();

	const category = getCategoryById(category_id);
	if (!category) throw new Error('Category not found');
	if (category.signup_count >= category.max_slots) throw new Error('Category is full');

	return db.prepare(`
		INSERT INTO signups (name, contact_info, category_id, notes) VALUES (?, ?, ?, ?)
	`).run(name, contact_info, category_id, notes);
}
