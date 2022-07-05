import camelCase from 'camelcase-keys';
import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

// ------------------- CONNECT TO DATABASE -------------------
config();
// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}
// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

// ------------------- USERS TABLE -------------------
// Declare type of user
export type User = {
  id: number;
  username: string;
};
type UserWithPasswordHash = User & {
  passwordHash: string;
};

// Function to store user in users table (for registration)
export async function createUser(username: string, passwordHash: string) {
  const [user] = await sql<[User]>`
  INSERT INTO users
    (username, password_hash)
  VALUES
    (${username}, ${passwordHash})
  RETURNING
    id,
    username
  `;
  return camelcaseKeys(user);
}

// Function to query database for user by username (for registration)
export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

// Function to query the user's password_hash (for login)
export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
     *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

// ------------------- SESSIONS TABLE -------------------
// Declare type of session
export type Session = {
  id: number;
  token: string;
};

// Function to create a session when the user logs in
export async function createSession(token: string, userId: User['id']) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
    (token, user_id)
  VALUES
    (${token}, ${userId})
  RETURNING
    id,
    token
  `;
  await deleteExpiredSessions();
  return camelcaseKeys(session);
}

// Function to get the logged-in user with a valid token
export async function getUserByValidSessionToken(token: string) {
  if (!token) return undefined;
  const [user] = await sql<[User | undefined]>`
  SELECT
    users.id,
    users.username
  FROM
    users,
    sessions
  WHERE
    sessions.token = ${token} and
    sessions.user_id = users.id and
    sessions.expiry_timestamp > now();
  `;
  await deleteExpiredSessions;
  return user && camelcaseKeys(user);
}
// Function to delete the session when the user logs out
// Finds the current valid token and deletes the user with this token from the session
export async function deleteSession(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM
    sessions
  WHERE
    sessions.token = ${token}
  RETURNING *
  `;
  return session && camelcaseKeys(session);
}

// Function to delete all sessions, that are expired
// Deletes the sessions from an array of sessions which have expired
export async function deleteExpiredSessions() {
  const sessions = await sql<[Session[]]>`
  DELETE FROM
    sessions
  WHERE
    expiry_timestamp < now()
  RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}
