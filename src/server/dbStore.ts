import fs from 'fs';
import path from 'path';
import { PRODUCTS } from '../data/products';
import {
  INITIAL_ORDERS,
  INITIAL_STORE_SETTINGS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_PAGES_CONTENT,
  INITIAL_MESSAGES,
} from '../data/adminStore';

// Determine writable location for serverless / read-only filesystem compatibility
const REPO_DB_FILE_PATH = path.join(process.cwd(), 'data', 'store_database.json');

function getDbFilePath(): string {
  // If running in Vercel or AWS Lambda, the root is read-only (EROFS) - use /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'store_database.json');
  }

  // Try standard path first
  try {
    const dir = path.dirname(REPO_DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.accessSync(dir, fs.constants.W_OK);
    return REPO_DB_FILE_PATH;
  } catch {
    // If standard path is not writable, fallback to /tmp
    return path.join('/tmp', 'store_database.json');
  }
}

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  products: any[];
  orders: any[];
  messages: any[];
  settings: {
    store: any;
    payment: any;
    pages_content: any;
    [key: string]: any;
  };
}

let inMemoryDb: DatabaseSchema | null = null;

function getInitialDatabase(): DatabaseSchema {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    products: PRODUCTS.map((p, idx) => ({
      ...p,
      id: p.id,
      productId: p.id,
      stock: p.stock ?? (idx === 0 ? 3 : 20),
      isOutOfStock: Boolean(p.isOutOfStock),
    })),
    orders: [...INITIAL_ORDERS],
    messages: [...INITIAL_MESSAGES],
    settings: {
      store: INITIAL_STORE_SETTINGS,
      payment: INITIAL_PAYMENT_CONFIG,
      pages_content: INITIAL_PAGES_CONTENT,
    },
  };
}

/**
 * Load database from disk, creating and initializing if missing
 */
export function loadDatabase(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  const writablePath = getDbFilePath();

  // Try reading from writablePath first, then fallback to REPO_DB_FILE_PATH if available
  const candidates = [writablePath, REPO_DB_FILE_PATH];

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          inMemoryDb = {
            version: parsed.version || 1,
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
            products: parsed.products,
            orders: Array.isArray(parsed.orders) ? parsed.orders : [...INITIAL_ORDERS],
            messages: Array.isArray(parsed.messages) ? parsed.messages : [...INITIAL_MESSAGES],
            settings: {
              store: parsed.settings?.store || INITIAL_STORE_SETTINGS,
              payment: parsed.settings?.payment || INITIAL_PAYMENT_CONFIG,
              pages_content: parsed.settings?.pages_content || INITIAL_PAGES_CONTENT,
              ...(parsed.settings || {}),
            },
          };
          // Try to persist to writable location if it came from repo path
          if (filePath !== writablePath) {
            saveDatabaseToDisk(inMemoryDb);
          }
          return inMemoryDb;
        }
      }
    } catch (err: any) {
      console.warn(`⚠️ [Local Persistent DB] Could not read ${filePath}:`, err.message);
    }
  }

  inMemoryDb = getInitialDatabase();
  saveDatabaseToDisk(inMemoryDb);
  return inMemoryDb;
}

/**
 * Save database to disk atomically without throwing on read-only environments
 */
export function saveDatabaseToDisk(db?: DatabaseSchema): void {
  const dataToSave = db || inMemoryDb;
  if (!dataToSave) return;

  dataToSave.lastUpdated = new Date().toISOString();

  try {
    const targetFile = getDbFilePath();
    const dir = path.dirname(targetFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempFile = `${targetFile}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
    fs.renameSync(tempFile, targetFile);
  } catch (err: any) {
    console.warn('⚠️ [Local Persistent DB] Notice: Disk write skipped or failed (in-memory state preserved):', err.message);
    // Do NOT throw error here to allow serverless / read-only execution to succeed
  }
}

// ----------------------------------------------------
// Product Operations
// ----------------------------------------------------
export function dbGetProducts(): any[] {
  const db = loadDatabase();
  return db.products;
}

export function dbSaveProduct(product: any): any {
  const db = loadDatabase();
  const targetId = product.id || product.productId || `prod_${Date.now()}`;
  const record = {
    ...product,
    id: targetId,
    productId: targetId,
    updatedAt: new Date().toISOString(),
  };

  const idx = db.products.findIndex((p) => p.id === targetId || p.productId === targetId);
  if (idx >= 0) {
    db.products[idx] = { ...db.products[idx], ...record };
  } else {
    record.createdAt = record.createdAt || new Date().toISOString();
    db.products.unshift(record);
  }

  saveDatabaseToDisk(db);
  return record;
}

export function dbUpdateProductStock(id: string, stock: number): any {
  const db = loadDatabase();
  const numStock = Math.max(0, Number(stock) || 0);
  const isOutOfStock = numStock <= 0;

  const idx = db.products.findIndex((p) => p.id === id || p.productId === id);
  if (idx >= 0) {
    db.products[idx].stock = numStock;
    db.products[idx].isOutOfStock = isOutOfStock;
    db.products[idx].updatedAt = new Date().toISOString();
    saveDatabaseToDisk(db);
    return db.products[idx];
  }
  return null;
}

export function dbDeleteProduct(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id && p.productId !== id);
  if (db.products.length !== initialLen) {
    saveDatabaseToDisk(db);
    return true;
  }
  return false;
}

export function dbBulkSaveProducts(products: any[]): void {
  const db = loadDatabase();
  db.products = [...products];
  saveDatabaseToDisk(db);
}

// ----------------------------------------------------
// Order Operations
// ----------------------------------------------------
export function dbGetOrders(): any[] {
  const db = loadDatabase();
  return db.orders;
}

export function dbSaveOrder(orderData: any): any {
  const db = loadDatabase();
  const orderNumber = orderData.orderNumber || orderData.id || `#${Date.now().toString().slice(-7)}`;
  const record = {
    ...orderData,
    orderNumber,
    updatedAt: new Date().toISOString(),
  };

  const idx = db.orders.findIndex((o) => o.orderNumber === orderNumber || o.id === orderNumber);
  if (idx >= 0) {
    db.orders[idx] = { ...db.orders[idx], ...record };
  } else {
    record.createdAt = record.createdAt || new Date().toISOString();
    db.orders.unshift(record);
  }

  saveDatabaseToDisk(db);
  return record;
}

export function dbUpdateOrder(orderNumber: string, updateData: any): any {
  const db = loadDatabase();
  const cleanTarget = (orderNumber || '').replace(/^#/, '');
  const idx = db.orders.findIndex((o) => {
    const oNum = (o.orderNumber || '').replace(/^#/, '');
    const oId = (o.id || '').replace(/^#/, '');
    return o.orderNumber === orderNumber || o.id === orderNumber || oNum === cleanTarget || oId === cleanTarget;
  });
  if (idx >= 0) {
    db.orders[idx] = {
      ...db.orders[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseToDisk(db);
    return db.orders[idx];
  }
  return null;
}

export function dbDeleteOrder(orderNumber: string): boolean {
  const db = loadDatabase();
  const initialLen = db.orders.length;
  const cleanTarget = (orderNumber || '').replace(/^#/, '');
  db.orders = db.orders.filter((o) => {
    const oNum = (o.orderNumber || '').replace(/^#/, '');
    const oId = (o.id || '').replace(/^#/, '');
    return o.orderNumber !== orderNumber && o.id !== orderNumber && oNum !== cleanTarget && oId !== cleanTarget;
  });
  if (db.orders.length !== initialLen) {
    saveDatabaseToDisk(db);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// Message Operations
// ----------------------------------------------------
export function dbGetMessages(): any[] {
  const db = loadDatabase();
  return db.messages;
}

export function dbSaveMessage(msgData: any): any {
  const db = loadDatabase();
  const id = msgData.id || `msg_${Date.now()}`;
  const record = {
    ...msgData,
    id,
    createdAt: new Date().toISOString(),
  };
  db.messages.unshift(record);
  saveDatabaseToDisk(db);
  return record;
}

export function dbUpdateMessage(id: string, updateData: any): any {
  const db = loadDatabase();
  const idx = db.messages.findIndex((m) => m.id === id || m._id === id);
  if (idx >= 0) {
    db.messages[idx] = {
      ...db.messages[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    saveDatabaseToDisk(db);
    return db.messages[idx];
  }
  return null;
}

export function dbDeleteMessage(id: string): boolean {
  const db = loadDatabase();
  const initialLen = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== id && m._id !== id);
  if (db.messages.length !== initialLen) {
    saveDatabaseToDisk(db);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// Settings Operations
// ----------------------------------------------------
export function dbGetSetting(key: string): any {
  const db = loadDatabase();
  return db.settings[key] || null;
}

export function dbSaveSetting(key: string, value: any): any {
  const db = loadDatabase();
  db.settings[key] = value;
  saveDatabaseToDisk(db);
  return value;
}
