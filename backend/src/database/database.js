import { db } from "./client.js";

export async function execute(sql, args = {}) {
  return db.execute({ sql, args });
}

export async function executeMultiple(statements) {
  return db.batch(statements);
}

export async function withTransaction(callback) {
  const transaction = await beginTransaction("write");
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
