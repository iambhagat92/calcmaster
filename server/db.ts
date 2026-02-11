import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

import path from "path";

const dbPath = process.env.VERCEL === "1" ? "/tmp/sqlite.db" : "sqlite.db";
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
