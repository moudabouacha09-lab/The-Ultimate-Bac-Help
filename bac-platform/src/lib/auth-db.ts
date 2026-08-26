// src/lib/auth-db.ts
import { UserProfile, AcademicBranch, AcademicLevel } from "./auth-types";
import fs from "fs";
import path from "path";

type UserRecord = UserProfile & {
  passwordHash: string;
};

// In-memory + persistent file storage fallback
const DB_FILE = path.join(process.cwd(), "data", "users-store.json");

function ensureDataDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadUsersLocal(): Record<string, UserRecord> {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local DB file:", err);
  }
  return {};
}

function saveUsersLocal(users: Record<string, UserRecord>) {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local DB file:", err);
  }
}

// Replit DB Helper (if REPLIT_DB_URL is present)
const REPLIT_DB_URL = process.env.REPLIT_DB_URL;

async function getReplitDbValue<T>(key: string): Promise<T | null> {
  if (!REPLIT_DB_URL) return null;
  try {
    const res = await fetch(`${REPLIT_DB_URL}/${encodeURIComponent(key)}`);
    if (res.ok) {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    }
  } catch (err) {
    console.error("Replit DB read error:", err);
  }
  return null;
}

async function setReplitDbValue<T>(key: string, value: T): Promise<boolean> {
  if (!REPLIT_DB_URL) return false;
  try {
    const res = await fetch(REPLIT_DB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
    });
    return res.ok;
  } catch (err) {
    console.error("Replit DB write error:", err);
  }
  return false;
}

// Global user finder and saver
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  
  if (REPLIT_DB_URL) {
    const user = await getReplitDbValue<UserRecord>(`user:${cleanEmail}`);
    if (user) return user;
  }

  const localUsers = loadUsersLocal();
  return localUsers[cleanEmail] || null;
}

export async function createUser(data: {
  username: string;
  email: string;
  passwordHash: string;
  branch: AcademicBranch;
  level: AcademicLevel;
}): Promise<UserProfile> {
  const cleanEmail = data.email.trim().toLowerCase();
  const id = "usr_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  
  const newUser: UserRecord = {
    id,
    username: data.username.trim(),
    email: cleanEmail,
    passwordHash: data.passwordHash,
    branch: data.branch,
    level: data.level,
    createdAt: new Date().toISOString()
  };

  if (REPLIT_DB_URL) {
    await setReplitDbValue(`user:${cleanEmail}`, newUser);
  }

  const localUsers = loadUsersLocal();
  localUsers[cleanEmail] = newUser;
  saveUsersLocal(localUsers);

  // Return public profile without passwordHash
  const { passwordHash, ...profile } = newUser;
  return profile;
}

export async function updateUserProfile(
  email: string,
  updates: Partial<Pick<UserProfile, "branch" | "level" | "username" | "targetGrade">>
): Promise<UserProfile | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const updatedUser: UserRecord = {
    ...user,
    ...updates
  };

  const cleanEmail = email.trim().toLowerCase();

  if (REPLIT_DB_URL) {
    await setReplitDbValue(`user:${cleanEmail}`, updatedUser);
  }

  const localUsers = loadUsersLocal();
  localUsers[cleanEmail] = updatedUser;
  saveUsersLocal(localUsers);

  const { passwordHash, ...profile } = updatedUser;
  return profile;
}
