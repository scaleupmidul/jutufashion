import express, { Request, Response } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { connectToDatabase, isDbConnected, getDbConnectionDiagnostics } from './db';
import { OrderModel, ProductModel, MessageModel, StoreSettingsModel } from './models';
import { PRODUCTS } from '../data/products';
import {
  INITIAL_ORDERS,
  INITIAL_STORE_SETTINGS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_PAGES_CONTENT,
  INITIAL_MESSAGES,
} from '../data/adminStore';
import {
  loadDatabase,
  saveDatabaseToDisk,
  dbGetProducts,
  dbSaveProduct,
  dbUpdateProductStock,
  dbDeleteProduct,
  dbBulkSaveProducts,
  dbGetOrders,
  dbSaveOrder,
  dbUpdateOrder,
  dbDeleteOrder,
  dbGetMessages,
  dbSaveMessage,
  dbUpdateMessage,
  dbDeleteMessage,
  dbGetSetting,
  dbSaveSetting,
} from './dbStore';

dotenv.config();

export const app = express();
const router = express.Router();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable full CORS and Preflight OPTIONS for all API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Normalize request path for serverless / proxy rewrites
app.use((req, res, next) => {
  const xForwardedUri = req.headers['x-forwarded-uri'] as string | undefined;
  const xVercelPath = req.headers['x-vercel-sc-path'] as string | undefined;
  const xMatchedPath = req.headers['x-matched-path'] as string | undefined;
  const matchedPath = xForwardedUri || xVercelPath || xMatchedPath;
  if (matchedPath && (req.url === '/api' || req.url === '/api/')) {
    req.url = matchedPath;
  }
  next();
});

// Serve static uploaded assets directly from /uploads (with serverless /tmp fallback)
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn('[Uploads] Could not create public/uploads folder:', e);
}
app.use('/uploads', express.static(uploadsDir));

const tmpUploadsDir = path.join('/tmp', 'uploads');
try {
  if (!fs.existsSync(tmpUploadsDir)) {
    fs.mkdirSync(tmpUploadsDir, { recursive: true });
  }
} catch (_) {}
app.use('/uploads', express.static(tmpUploadsDir));


// ----------------------------------------------------
// Helper Utilities & Meta Hashing
// ----------------------------------------------------
function hashMetaField(val?: string | null): string | undefined {
  if (!val || typeof val !== 'string') return undefined;
  const normalized = val.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function normalizeAndHashPhone(phone?: string | null): string | undefined {
  if (!phone || typeof phone !== 'string') return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('01')) {
    digits = '88' + digits;
  } else if (digits.startsWith('1') && digits.length === 10) {
    digits = '880' + digits;
  }
  return crypto.createHash('sha256').update(digits).digest('hex');
}

/**
 * Remove immutable MongoDB fields like _id and __v before $set / upsert operations
 */
function cleanMongoPayload<T = any>(data: T): T {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map((item) => cleanMongoPayload(item)) as any;
  }
  const clone: any = { ...(data as any) };
  delete clone._id;
  delete clone.__v;
  return clone;
}

// Event tracking store for Meta CAPI
const recentEvents: any[] = [];
const eventCounts: Record<string, number> = {
  PageView: 0,
  ViewContent: 0,
  AddToCart: 0,
  InitiateCheckout: 0,
  Purchase: 0,
  Contact: 0,
  Search: 0,
};

// Auto-seed and sync database on setup
async function ensureDatabaseSeeded(): Promise<void> {
  // Ensure local persistent JSON database file exists and is populated
  loadDatabase();

  try {
    if (!isDbConnected()) return;
    const seedCheck = await StoreSettingsModel.findOne({ key: 'has_seeded_initial_catalog_v3' });
    if (seedCheck) {
      return; // Already initialized once
    }

    console.log('🌱 [MongoDB Atlas] Initializing and seeding store data into MongoDB Atlas...');

    // 1. Seed Products if empty
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      const dbProducts = dbGetProducts();
      const seedItems = (dbProducts.length > 0 ? dbProducts : PRODUCTS).map((p: any, idx: number) => ({
        id: p.id,
        productId: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        gender: p.gender,
        price: p.price,
        originalPrice: p.originalPrice,
        stock: p.stock ?? (idx === 0 ? 3 : 20),
        isOutOfStock: Boolean(p.isOutOfStock),
        badge: p.badge,
        description: p.description,
        materials: p.materials,
        features: p.features,
        idealFor: p.idealFor,
        buildQuality: p.buildQuality,
        rating: p.rating || 4.9,
        reviewCount: p.reviewCount || 120,
        colors: p.colors,
        sizes: p.sizes,
        isCustomCreated: false,
      }));
      await ProductModel.insertMany(seedItems);
      console.log(`✅ [MongoDB Atlas] Seeded ${seedItems.length} footwear products.`);
    }

    // 2. Seed Initial Orders if empty
    const orderCount = await OrderModel.countDocuments();
    const dbOrders = dbGetOrders();
    const ordersToSeed = dbOrders.length > 0 ? dbOrders : INITIAL_ORDERS;
    if (orderCount === 0 && ordersToSeed.length > 0) {
      for (const ord of ordersToSeed) {
        await (OrderModel as any).findOneAndUpdate(
          { orderNumber: ord.orderNumber },
          { $set: ord },
          { upsert: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`✅ [MongoDB Atlas] Seeded ${ordersToSeed.length} initial orders.`);
    }

    // 3. Seed Initial Messages if empty
    const msgCount = await MessageModel.countDocuments();
    const dbMessages = dbGetMessages();
    const messagesToSeed = dbMessages.length > 0 ? dbMessages : INITIAL_MESSAGES;
    if (msgCount === 0 && messagesToSeed.length > 0) {
      for (const msg of messagesToSeed) {
        await (MessageModel as any).findOneAndUpdate(
          { id: msg.id },
          { $set: msg },
          { upsert: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`✅ [MongoDB Atlas] Seeded ${messagesToSeed.length} customer messages.`);
    }

    // 4. Seed Store Settings if missing
    const existingStoreSettings = await StoreSettingsModel.findOne({ key: 'store' });
    if (!existingStoreSettings) {
      const storeVal = dbGetSetting('store') || INITIAL_STORE_SETTINGS;
      await (StoreSettingsModel as any).create({ key: 'store', value: storeVal });
    }

    // 5. Seed Payment Config if missing
    const existingPaymentConfig = await StoreSettingsModel.findOne({ key: 'payment' });
    if (!existingPaymentConfig) {
      const payVal = dbGetSetting('payment') || INITIAL_PAYMENT_CONFIG;
      await (StoreSettingsModel as any).create({ key: 'payment', value: payVal });
    }

    // 6. Seed Pages Content if missing
    const existingPagesContent = await StoreSettingsModel.findOne({ key: 'pages_content' });
    if (!existingPagesContent) {
      const pagesVal = dbGetSetting('pages_content') || INITIAL_PAGES_CONTENT;
      await (StoreSettingsModel as any).create({ key: 'pages_content', value: pagesVal });
    }

    // Mark seed completed
    await StoreSettingsModel.findOneAndUpdate(
      { key: 'has_seeded_initial_catalog_v3' },
      { key: 'has_seeded_initial_catalog_v3', value: { seededAt: new Date().toISOString() } },
      { upsert: true }
    );
    console.log('🎉 [MongoDB Atlas] Database seed completed successfully!');
  } catch (err: any) {
    console.error('⚠️ [MongoDB Atlas] Error during database seeding:', err.message);
  }
}

// ----------------------------------------------------
// 1. Health & Database Status Endpoints
// ----------------------------------------------------
router.get('/health', async (req: Request, res: Response) => {
  const dbStatus = await connectToDatabase();
  await ensureDatabaseSeeded();
  const currentDb = loadDatabase();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'JUTU E-Commerce API',
    persistentFileDb: {
      active: true,
      path: 'data/store_database.json',
      productsCount: currentDb.products.length,
    },
    mongodb: {
      connected: dbStatus.isConnected,
      driver: 'MongoDB / Mongoose',
      error: dbStatus.error || null,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

router.get('/db-status', async (req: Request, res: Response) => {
  await connectToDatabase();
  await ensureDatabaseSeeded();
  const diag = getDbConnectionDiagnostics();
  const currentDb = loadDatabase();

  let productsCount = currentDb.products.length;
  let ordersCount = currentDb.orders.length;
  let messagesCount = currentDb.messages.length;

  if (isDbConnected()) {
    try {
      [productsCount, ordersCount, messagesCount] = await Promise.all([
        ProductModel.countDocuments(),
        OrderModel.countDocuments(),
        MessageModel.countDocuments(),
      ]);
    } catch {}
  }

  res.json({
    ...diag,
    persistentFileDb: {
      active: true,
      path: 'data/store_database.json',
      lastUpdated: currentDb.lastUpdated,
      productsCount: currentDb.products.length,
      ordersCount: currentDb.orders.length,
      messagesCount: currentDb.messages.length,
    },
    stats: {
      productsCount,
      ordersCount,
      messagesCount,
    },
  });
});

const handleDbTest = async (req: Request, res: Response) => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const currentDb = loadDatabase();
    await connectToDatabase();
    const diag = getDbConnectionDiagnostics();

    if (isDbConnected()) {
      return res.json({
        success: true,
        message: 'MongoDB Atlas is successfully connected and responding.',
        diagnostics: diag,
        persistentFileDb: {
          active: true,
          productsCount: currentDb.products.length,
          ordersCount: currentDb.orders.length,
          messagesCount: currentDb.messages.length,
        },
      });
    }

    if (!mongoUri) {
      return res.json({
        success: true,
        fallbackActive: true,
        message: 'No MONGODB_URI provided. Active storage is using the reliable Server Persistent File Database (data/store_database.json).',
        diagnostics: diag,
        persistentFileDb: {
          active: true,
          productsCount: currentDb.products.length,
          ordersCount: currentDb.orders.length,
          messagesCount: currentDb.messages.length,
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: `Failed to connect to MongoDB: ${diag.lastError || 'Unknown connection error'}`,
      diagnostics: diag,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Database test encountered an unexpected exception',
      error: err.message,
    });
  }
};

router.post('/db-test', handleDbTest);
router.get('/db-test', handleDbTest);

// ----------------------------------------------------
// 2. Comprehensive All-In-One Store Sync Endpoints
// ----------------------------------------------------
router.post('/store/push-all-local', async (req: Request, res: Response) => {
  try {
    const { products, orders, messages, settings, paymentConfig, pagesContent } = req.body;
    await connectToDatabase();
    const isConnected = isDbConnected();

    // 1. Always save into server persistent disk database
    const db = loadDatabase();
    if (Array.isArray(products) && products.length > 0) {
      db.products = [...products];
    }
    if (Array.isArray(orders) && orders.length > 0) {
      db.orders = [...orders];
    }
    if (Array.isArray(messages) && messages.length > 0) {
      db.messages = [...messages];
    }
    if (settings && typeof settings === 'object') {
      db.settings.store = settings;
    }
    if (paymentConfig && typeof paymentConfig === 'object') {
      db.settings.payment = paymentConfig;
    }
    if (pagesContent && typeof pagesContent === 'object') {
      db.settings.pages_content = pagesContent;
    }
    saveDatabaseToDisk(db);

    const syncedProducts = products?.length || 0;
    const syncedOrders = orders?.length || 0;
    const syncedMessages = messages?.length || 0;

    // 2. If MongoDB Atlas is connected, also upsert everything into MongoDB collections
    if (isConnected) {
      if (Array.isArray(products) && products.length > 0) {
        for (const prod of products) {
          const prodId = prod.id || prod.productId;
          if (prodId) {
            const cleanProd = cleanMongoPayload({ ...prod, id: prodId, productId: prodId });
            await (ProductModel as any).findOneAndUpdate(
              { $or: [{ id: prodId }, { productId: prodId }] },
              { $set: cleanProd },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
          }
        }
      }

      if (Array.isArray(orders) && orders.length > 0) {
        for (const ord of orders) {
          const ordId = ord.orderNumber || ord.id;
          if (ordId) {
            const cleanOrd = cleanMongoPayload(ord);
            await (OrderModel as any).findOneAndUpdate(
              { $or: [{ orderNumber: ord.orderNumber }, { id: ord.id }] },
              { $set: cleanOrd },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
          }
        }
      }

      if (Array.isArray(messages) && messages.length > 0) {
        for (const msg of messages) {
          const msgId = msg.id || msg._id;
          if (msgId) {
            const cleanMsg = cleanMongoPayload(msg);
            await (MessageModel as any).findOneAndUpdate(
              { $or: [{ id: msgId }, { _id: msgId }] },
              { $set: cleanMsg },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
          }
        }
      }

      if (settings && typeof settings === 'object') {
        await (StoreSettingsModel as any).findOneAndUpdate(
          { key: 'store' },
          { $set: { key: 'store', value: settings } },
          { upsert: true, new: true }
        );
      }

      if (paymentConfig && typeof paymentConfig === 'object') {
        await (StoreSettingsModel as any).findOneAndUpdate(
          { key: 'payment' },
          { $set: { key: 'payment', value: paymentConfig } },
          { upsert: true, new: true }
        );
      }

      if (pagesContent && typeof pagesContent === 'object') {
        await (StoreSettingsModel as any).findOneAndUpdate(
          { key: 'pages_content' },
          { $set: { key: 'pages_content', value: pagesContent } },
          { upsert: true, new: true }
        );
      }

      console.log(`☁️ [Database Sync] Complete: ${syncedProducts} products, ${syncedOrders} orders, ${syncedMessages} messages pushed to Database.`);

      return res.json({
        success: true,
        source: 'mongodb_and_persistent_file',
        isDbConnected: true,
        syncedCounts: { products: syncedProducts, orders: syncedOrders, messages: syncedMessages },
        message: 'Successfully saved and synchronized all store records to Database!',
      });
    }

    return res.json({
      success: true,
      source: 'persistent_file_database',
      isDbConnected: false,
      syncedCounts: { products: syncedProducts, orders: syncedOrders, messages: syncedMessages },
      message: 'Saved permanently to server database file (data/store_database.json)',
    });
  } catch (err: any) {
    console.error('❌ [Database Push Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// 2. Comprehensive All-In-One Store Bootstrap Endpoint
// ----------------------------------------------------
router.get('/store/all', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();
    const db = loadDatabase();

    if (isDbConnected()) {
      const [products, orders, messages, settingsDoc, paymentDoc, pagesDoc] = await Promise.all([
        ProductModel.find().sort({ createdAt: -1 }),
        OrderModel.find().sort({ createdAt: -1 }).limit(150),
        MessageModel.find().sort({ createdAt: -1 }).limit(100),
        StoreSettingsModel.findOne({ key: 'store' }),
        StoreSettingsModel.findOne({ key: 'payment' }),
        StoreSettingsModel.findOne({ key: 'pages_content' }),
      ]);

      const formattedProducts = products.map((doc: any) => {
        const p = doc.toObject ? doc.toObject() : doc;
        return {
          ...p,
          id: p.id || p.productId || doc._id.toString(),
        };
      });

      return res.json({
        success: true,
        source: 'mongodb',
        isDbConnected: true,
        data: {
          products: formattedProducts.length > 0 ? formattedProducts : db.products,
          orders: orders || db.orders,
          messages: messages || db.messages,
          settings: settingsDoc ? settingsDoc.value : db.settings.store,
          paymentConfig: paymentDoc ? paymentDoc.value : db.settings.payment,
          pagesContent: pagesDoc ? pagesDoc.value : db.settings.pages_content,
        },
      });
    }

    return res.json({
      success: true,
      source: 'persistent_file_database',
      isDbConnected: false,
      data: {
        products: db.products,
        orders: db.orders,
        messages: db.messages,
        settings: db.settings.store,
        paymentConfig: db.settings.payment,
        pagesContent: db.settings.pages_content,
      },
    });
  } catch (err: any) {
    const db = loadDatabase();
    return res.status(500).json({
      success: false,
      error: err.message,
      data: {
        products: db.products,
        orders: db.orders,
        messages: db.messages,
        settings: db.settings.store,
        paymentConfig: db.settings.payment,
        pagesContent: db.settings.pages_content,
      },
    });
  }
});

// ----------------------------------------------------
// 3. Orders API (Persistent File + MongoDB)
// ----------------------------------------------------
router.get('/orders', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(100);
      return res.json({ success: true, source: 'mongodb', data: orders });
    }
    return res.json({ success: true, source: 'persistent_file_database', data: dbGetOrders() });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message, fallback: dbGetOrders() });
  }
});

const handleCreateOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body || {};
    const orderNumber = orderData.orderNumber || orderData.id || `#${Date.now().toString().slice(-7)}`;
    const items = Array.isArray(orderData.items) ? orderData.items : [];
    
    // Normalize shippingAddress from customer object if shippingAddress is not directly provided
    const shippingAddress = orderData.shippingAddress || {
      firstName: orderData.customer?.name || orderData.customerName || 'Customer',
      phone: orderData.customer?.phone || orderData.phone || '',
      address: orderData.customer?.address || orderData.address || '',
      city: orderData.customer?.city || orderData.city || 'Dhaka',
    };

    const payload = {
      ...orderData,
      orderNumber,
      id: orderData.id || orderNumber,
      items,
      shippingAddress,
      total: Number(orderData.total) || 0,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'cod',
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to persistent file DB safely
    let savedLocal: any = null;
    try {
      savedLocal = dbSaveOrder(payload);
    } catch (localErr: any) {
      console.warn('⚠️ [Local Order Save Warning]', localErr.message);
    }

    // 2. If MongoDB Atlas connected, upsert to MongoDB
    await connectToDatabase();
    if (isDbConnected()) {
      const cleanNum = orderNumber.replace(/^#/, '');
      const mongoPayload = cleanMongoPayload(payload);
      const created = await (OrderModel as any).findOneAndUpdate(
        {
          $or: [
            { orderNumber },
            { id: orderNumber },
            { orderNumber: cleanNum },
            { orderNumber: `#${cleanNum}` },
          ],
        },
        { $set: mongoPayload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(201).json({ success: true, source: 'mongodb_and_persistent_file', data: created });
    }

    return res.status(201).json({ success: true, source: 'persistent_file_database', data: savedLocal || payload });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.post('/orders', handleCreateOrder);

const handleUpdateOrder = async (req: Request, res: Response) => {
  try {
    const orderNumber = req.params.orderNumber || (req.query.orderNumber as string) || req.body?.orderNumber || req.body?.id;
    if (!orderNumber) {
      return res.status(400).json({ success: false, error: 'Order number is required for update' });
    }
    const updateData = req.body || {};

    // 1. Update in persistent disk DB
    let updatedLocal: any = null;
    try {
      updatedLocal = dbUpdateOrder(orderNumber, updateData);
    } catch (localErr: any) {
      console.warn('⚠️ [Local Order Update Warning]', localErr.message);
    }

    // 2. Update in MongoDB
    await connectToDatabase();
    if (isDbConnected()) {
      const cleanNum = orderNumber.replace(/^#/, '');
      const isOid = mongoose.isValidObjectId(orderNumber);
      const mongoUpdate = cleanMongoPayload({ ...updateData, updatedAt: new Date().toISOString() });
      const updated = await (OrderModel as any).findOneAndUpdate(
        {
          $or: [
            { orderNumber },
            { id: orderNumber },
            { orderNumber: cleanNum },
            { orderNumber: `#${cleanNum}` },
            ...(isOid ? [{ _id: orderNumber }] : []),
          ],
        },
        { $set: mongoUpdate },
        { new: true }
      );
      return res.json({ success: true, source: 'mongodb_and_persistent_file', data: updated || updatedLocal });
    }

    if (updatedLocal) {
      return res.json({ success: true, source: 'persistent_file_database', data: updatedLocal });
    }
    return res.status(404).json({ success: false, error: 'Order not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.put('/orders/:orderNumber', handleUpdateOrder);
router.put('/orders', handleUpdateOrder);
router.post('/orders/:orderNumber', handleUpdateOrder);

const handleDeleteOrder = async (req: Request, res: Response) => {
  try {
    const orderNumber = req.params.orderNumber || (req.query.orderNumber as string) || (req.query.id as string) || req.body?.orderNumber || req.body?.id;
    if (!orderNumber) {
      return res.status(400).json({ success: false, error: 'Order number or ID is required for deletion' });
    }

    // 1. Delete from local persistent file database
    dbDeleteOrder(orderNumber);

    // 2. Delete 100% from MongoDB Atlas
    await connectToDatabase();
    if (isDbConnected()) {
      const isOid = mongoose.isValidObjectId(orderNumber);
      await (OrderModel as any).deleteMany({
        $or: [
          { orderNumber },
          { id: orderNumber },
          ...(isOid ? [{ _id: orderNumber }] : []),
        ],
      });
    }

    return res.json({ success: true, message: `Order ${orderNumber} deleted successfully from 100% of database` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.delete('/orders/:orderNumber', handleDeleteOrder);
router.delete('/orders', handleDeleteOrder);

// ----------------------------------------------------
// 4. Products API (Persistent File + MongoDB)
// ----------------------------------------------------
router.get('/products', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();

    if (isDbConnected()) {
      const products = await ProductModel.find().sort({ createdAt: -1 });
      const formatted = products.map((doc: any) => {
        const p = doc.toObject ? doc.toObject() : doc;
        return {
          ...p,
          id: p.id || p.productId || doc._id.toString(),
        };
      });
      return res.json({ success: true, source: 'mongodb', data: formatted.length > 0 ? formatted : dbGetProducts() });
    }
    return res.json({ success: true, source: 'persistent_file_database', data: dbGetProducts() });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message, fallback: dbGetProducts() });
  }
});

const handleSaveProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body || {};
    const urlId = req.params.id || (req.query.id as string);
    const targetId = urlId || productData.id || productData.productId || `prod_${Date.now()}`;
    const payload = {
      ...productData,
      id: targetId,
      productId: targetId,
    };

    // 1. Save to server persistent disk database safely
    let savedLocal: any = null;
    try {
      savedLocal = dbSaveProduct(payload);
    } catch (localErr: any) {
      console.warn('⚠️ [Local Product Save Warning] Proceeding with in-memory/MongoDB sync:', localErr.message);
    }

    // 2. If MongoDB connected, upsert to MongoDB safely
    try {
      await connectToDatabase();
      if (isDbConnected()) {
        const isOid = mongoose.isValidObjectId(targetId);
        const mongoPayload = cleanMongoPayload(payload);
        const saved = await (ProductModel as any).findOneAndUpdate(
          {
            $or: [
              { id: targetId },
              { productId: targetId },
              ...(isOid ? [{ _id: targetId }] : []),
            ],
          },
          { $set: mongoPayload },
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        return res.status(200).json({ success: true, source: 'mongodb_and_persistent_file', data: saved });
      }
    } catch (mongoErr: any) {
      console.warn('⚠️ [MongoDB Product Save Warning] Successfully saved to local persistent store, MongoDB notice:', mongoErr.message);
    }

    return res.status(200).json({ success: true, source: 'persistent_file_database', data: savedLocal || payload });
  } catch (err: any) {
    console.error('❌ [Product Save Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to save product to database' });
  }
};

router.post('/products', handleSaveProduct);
router.post('/products/:id', handleSaveProduct);
router.put('/products', handleSaveProduct);
router.put('/products/:id', handleSaveProduct);

const handleUpdateStock = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || (req.query.id as string) || req.body?.id;
    const { stock } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: 'Product id is required' });
    }
    const numStock = Math.max(0, Number(stock) || 0);

    // 1. Update in persistent file DB
    const updatedLocal = dbUpdateProductStock(id, numStock);

    // 2. Update in MongoDB safely
    try {
      await connectToDatabase();
      if (isDbConnected()) {
        const isOid = mongoose.isValidObjectId(id);
        const updated = await (ProductModel as any).findOneAndUpdate(
          {
            $or: [
              { id },
              { productId: id },
              ...(isOid ? [{ _id: id }] : []),
            ],
          },
          { $set: { stock: numStock, isOutOfStock: numStock <= 0, updatedAt: new Date().toISOString() } },
          { returnDocument: 'after' }
        );
        return res.json({ success: true, source: 'mongodb_and_persistent_file', data: updated || updatedLocal });
      }
    } catch (mErr: any) {
      console.warn('⚠️ [MongoDB Stock Update Warning]:', mErr.message);
    }

    if (updatedLocal) {
      return res.json({ success: true, source: 'persistent_file_database', data: updatedLocal });
    }
    return res.json({ success: true, source: 'memory_fallback', data: { id, stock: numStock, isOutOfStock: numStock <= 0 } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.put('/products/stock/:id', handleUpdateStock);
router.put('/products/stock', handleUpdateStock);
router.post('/products/stock/:id', handleUpdateStock);
router.post('/products/stock', handleUpdateStock);
router.patch('/products/stock/:id', handleUpdateStock);
router.patch('/products/stock', handleUpdateStock);
router.put('/products/:id/stock', handleUpdateStock);
router.post('/products/:id/stock', handleUpdateStock);
router.patch('/products/:id/stock', handleUpdateStock);

const handleDeleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || (req.query.id as string) || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Product id is required for deletion' });
    }

    // 1. Delete from local persistent file database
    dbDeleteProduct(id);

    // 2. Delete 100% from MongoDB Atlas (deleteMany to remove all duplicate/matching records)
    await connectToDatabase();
    if (isDbConnected()) {
      const isOid = mongoose.isValidObjectId(id);
      const deleteResult = await ProductModel.deleteMany({
        $or: [
          { id },
          { productId: id },
          ...(isOid ? [{ _id: id }] : []),
        ],
      });
      console.log(`[Database] Deleted product ${id} from MongoDB. Deleted count:`, deleteResult.deletedCount);
    }

    return res.json({ success: true, message: `Product ${id} deleted successfully from 100% of database` });
  } catch (err: any) {
    console.error('[Database Error] Failed to delete product:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.delete('/products/:id', handleDeleteProduct);
router.delete('/products', handleDeleteProduct);

router.post('/products/bulk', async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'products must be an array' });
    }

    dbBulkSaveProducts(products);

    try {
      await connectToDatabase();
      if (isDbConnected()) {
        for (const prod of products) {
          const prodId = prod.id || prod.productId;
          if (prodId) {
            const cleanProd = cleanMongoPayload({ ...prod, id: prodId, productId: prodId });
            await (ProductModel as any).findOneAndUpdate(
              { $or: [{ id: prodId }, { productId: prodId }] },
              { $set: cleanProd },
              { upsert: true, returnDocument: 'after' }
            );
          }
        }
        return res.json({ success: true, source: 'mongodb_and_persistent_file', count: products.length });
      }
    } catch (mErr: any) {
      console.warn('⚠️ [MongoDB Bulk Products Warning]:', mErr.message);
    }

    return res.json({ success: true, source: 'persistent_file_database', count: products.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 5. Messages / Contact Inquiries API
// ----------------------------------------------------
router.get('/messages', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const messages = await MessageModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: 'mongodb', data: messages });
    }
    return res.json({ success: true, source: 'persistent_file_database', data: dbGetMessages() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/messages', async (req: Request, res: Response) => {
  try {
    const msgData = req.body;
    let savedLocal: any = null;
    try {
      savedLocal = dbSaveMessage(msgData);
    } catch (localErr: any) {
      console.warn('⚠️ [Local Message Save Warning]', localErr.message);
    }

    await connectToDatabase();
    if (isDbConnected()) {
      const cleanMsg = cleanMongoPayload(msgData);
      const created = await (MessageModel as any).create(cleanMsg);
      return res.status(201).json({ success: true, source: 'mongodb_and_persistent_file', data: created });
    }
    return res.status(201).json({ success: true, source: 'persistent_file_database', data: savedLocal || msgData });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/messages/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updatedLocal: any = null;
    try {
      updatedLocal = dbUpdateMessage(id, updateData);
    } catch (localErr: any) {
      console.warn('⚠️ [Local Message Update Warning]', localErr.message);
    }

    await connectToDatabase();
    if (isDbConnected()) {
      const cleanUpdate = cleanMongoPayload(updateData);
      const updated = await (MessageModel as any).findOneAndUpdate(
        { $or: [{ _id: id }, { id }] },
        { $set: cleanUpdate },
        { new: true }
      );
      return res.json({ success: true, source: 'mongodb_and_persistent_file', data: updated || updatedLocal });
    }

    if (updatedLocal) {
      return res.json({ success: true, source: 'persistent_file_database', data: updatedLocal });
    }
    return res.status(404).json({ error: 'Message not found' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

const handleDeleteMessage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || (req.query.id as string) || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Message ID is required for deletion' });
    }

    // 1. Delete from local persistent database
    dbDeleteMessage(id);

    // 2. Delete 100% from MongoDB Atlas
    await connectToDatabase();
    if (isDbConnected()) {
      const isOid = mongoose.isValidObjectId(id);
      await (MessageModel as any).deleteMany({
        $or: [
          ...(isOid ? [{ _id: id }] : []),
          { id },
        ],
      });
    }
    return res.json({ success: true, message: `Message ${id} deleted successfully from 100% of database` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.delete('/messages/:id', handleDeleteMessage);
router.delete('/messages', handleDeleteMessage);

// ----------------------------------------------------
// 6. Store Settings API (Persistent File + MongoDB)
// ----------------------------------------------------
router.get('/settings', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const [storeDoc, paymentDoc, pagesDoc] = await Promise.all([
        StoreSettingsModel.findOne({ key: 'store' }),
        StoreSettingsModel.findOne({ key: 'payment' }),
        StoreSettingsModel.findOne({ key: 'pages_content' }),
      ]);
      return res.json({
        success: true,
        source: 'mongodb',
        data: {
          store: storeDoc ? (storeDoc as any).value : dbGetSetting('store'),
          payment: paymentDoc ? (paymentDoc as any).value : dbGetSetting('payment'),
          pages_content: pagesDoc ? (pagesDoc as any).value : dbGetSetting('pages_content'),
        },
      });
    }
    return res.json({
      success: true,
      source: 'persistent_file_database',
      data: {
        store: dbGetSetting('store'),
        payment: dbGetSetting('payment'),
        pages_content: dbGetSetting('pages_content'),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/settings/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    await connectToDatabase();
    if (isDbConnected()) {
      const setting: any = await StoreSettingsModel.findOne({ key });
      return res.json({ success: true, source: 'mongodb', data: setting ? setting.value : dbGetSetting(key) });
    }
    return res.json({ success: true, source: 'persistent_file_database', data: dbGetSetting(key) || null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/settings/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    // 1. Save to server persistent file database immediately
    dbSaveSetting(key, value);

    // 2. If MongoDB Atlas connected, upsert into MongoDB collection
    await connectToDatabase();
    if (isDbConnected()) {
      const setting: any = await (StoreSettingsModel as any).findOneAndUpdate(
        { key },
        { $set: { key, value } },
        { upsert: true, new: true }
      );
      return res.json({ success: true, source: 'mongodb_and_persistent_file', data: setting ? setting.value : value });
    }

    return res.json({ success: true, source: 'persistent_file_database', data: value });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 6.5. Image & Asset Upload Endpoint
// ----------------------------------------------------
const handleAssetUpload = async (req: Request, res: Response) => {
  try {
    const { data, image, filename, type } = req.body;
    const rawData = data || image;
    if (!rawData || typeof rawData !== 'string') {
      return res.status(400).json({ success: false, error: 'Image data is required (base64 or Data URL)' });
    }

    let mime = type || 'image/png';
    let base64String = rawData;

    const dataUrlMatch = rawData.match(/^data:([^;]+);base64,(.+)$/);
    if (dataUrlMatch) {
      mime = dataUrlMatch[1];
      base64String = dataUrlMatch[2];
    }

    let ext = 'png';
    if (mime.includes('svg')) ext = 'svg';
    else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
    else if (mime.includes('webp')) ext = 'webp';
    else if (mime.includes('gif')) ext = 'gif';

    const safeBaseName = (filename || 'logo')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueFilename = `${safeBaseName}_${Date.now()}.${ext}`;

    const buffer = Buffer.from(base64String, 'base64');
    let written = false;

    // Try public/uploads first
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, uniqueFilename), buffer);
      written = true;
    } catch (writeErr) {
      console.warn('[Upload] Could not write to public/uploads, trying /tmp/uploads:', writeErr);
      try {
        if (!fs.existsSync(tmpUploadsDir)) {
          fs.mkdirSync(tmpUploadsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(tmpUploadsDir, uniqueFilename), buffer);
        written = true;
      } catch (tmpErr) {
        console.error('[Upload] Could not write to /tmp/uploads:', tmpErr);
      }
    }

    if (written) {
      const publicUrl = `/uploads/${uniqueFilename}`;
      return res.json({
        success: true,
        url: publicUrl,
        filename: uniqueFilename,
        size: buffer.length,
        mime,
      });
    }

    // Disk write fallback: return valid data URL
    const cleanUrl = rawData.startsWith('data:') ? rawData : `data:${mime};base64,${base64String}`;
    return res.json({
      success: true,
      url: cleanUrl,
      filename: uniqueFilename,
      size: buffer.length,
      mime,
      fallback: 'data_url',
    });
  } catch (err: any) {
    console.error('[Upload API Error]:', err);
    return res.status(500).json({ success: false, error: err.message || 'Upload failed' });
  }
};

router.post('/upload', handleAssetUpload);
router.post('/upload/image', handleAssetUpload);



// ----------------------------------------------------
// 7. Meta Conversions API / Server Tracking Endpoint
// ----------------------------------------------------
router.post('/tracking/meta-event', async (req: Request, res: Response) => {
  try {
    const {
      event_name,
      event_id,
      event_time,
      event_source_url,
      user_data = {},
      custom_data = {},
      action_source = 'website',
    } = req.body;

    if (!event_name) {
      return res.status(400).json({ error: 'event_name is required' });
    }

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '';
    const clientUserAgent = (req.headers['user-agent'] as string) || '';

    const hashedUserData: Record<string, any> = {
      client_ip_address: user_data.client_ip_address || clientIp,
      client_user_agent: user_data.client_user_agent || clientUserAgent,
    };

    // 1. Full Name under first_name (fn) as collected on website checkout form
    const customerFullName = (user_data.first_name || user_data.full_name || '').trim();
    if (customerFullName) {
      hashedUserData.fn = [hashMetaField(customerFullName)];
    }

    // 2. Phone Number
    if (user_data.phone) {
      hashedUserData.ph = [normalizeAndHashPhone(user_data.phone)];
    }

    // 3. Email Address (if provided)
    if (user_data.email) {
      hashedUserData.em = [hashMetaField(user_data.email)];
    }

    // 4. City / District
    if (user_data.city) {
      hashedUserData.ct = [hashMetaField(user_data.city)];
    }

    // 5. State / Division
    if (user_data.state || user_data.division) {
      hashedUserData.st = [hashMetaField(user_data.state || user_data.division)];
    }

    // 6. Country
    if (user_data.country) {
      const countryStr = String(user_data.country).trim().toLowerCase();
      hashedUserData.country = [hashMetaField(countryStr === 'bangladesh' || countryStr === 'bd' ? 'bd' : countryStr)];
    }

    if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
    if (user_data.external_id) {
      const extIds = Array.isArray(user_data.external_id) ? user_data.external_id : [user_data.external_id];
      hashedUserData.external_id = extIds.map((id: string) => hashMetaField(id)).filter(Boolean);
    }

    const payloadEventId = event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const unixTimestamp = event_time || Math.floor(Date.now() / 1000);

    const metaPayload: Record<string, any> = {
      event_name,
      event_time: unixTimestamp,
      event_id: payloadEventId,
      event_source_url: event_source_url || req.headers.referer || 'https://jutu.com',
      action_source,
      user_data: hashedUserData,
      custom_data,
    };

    const datasetId = process.env.META_DATASET_ID || process.env.META_PIXEL_ID || req.body.dataset_id || req.body.meta_pixel_id;
    const accessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_TOKEN || req.body.access_token || req.body.meta_capi_token;
    const testEventCode = process.env.META_TEST_EVENT_CODE || req.body.test_event_code || req.body.meta_test_event_code;

    const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID || process.env.GA4_ID || req.body.ga4_measurement_id || req.body.ga4_id;
    const ga4ApiSecret = process.env.GA4_API_SECRET || req.body.ga4_api_secret;

    let dispatchStatus: 'sent_to_meta' | 'simulated_sandbox' | 'error' = 'simulated_sandbox';
    let metaApiResponse: any = null;
    let ga4ApiResponse: any = null;

    // 1. Send to Meta Conversions API
    if (datasetId && accessToken) {
      try {
        const metaApiUrl = `https://graph.facebook.com/v19.0/${datasetId}/events?access_token=${accessToken}`;
        const requestBody: Record<string, any> = {
          data: [metaPayload],
        };
        if (testEventCode) {
          requestBody.test_event_code = testEventCode;
        }

        const response = await fetch(metaApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        metaApiResponse = await response.json();
        if (response.ok) {
          dispatchStatus = 'sent_to_meta';
        } else {
          dispatchStatus = 'error';
          console.warn('[Meta CAPI Error]', metaApiResponse);
        }
      } catch (apiErr: any) {
        dispatchStatus = 'error';
        metaApiResponse = { error: apiErr.message };
        console.error('[Meta CAPI Network Error]', apiErr);
      }
    }

    // 2. Send to GA4 Measurement Protocol
    if (ga4MeasurementId && ga4ApiSecret) {
      try {
        const ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4ApiSecret}`;
        
        // Map standard event to GA4 event name
        let ga4EventName = 'page_view';
        if (event_name === 'ViewContent') ga4EventName = 'view_item';
        else if (event_name === 'AddToCart') ga4EventName = 'add_to_cart';
        else if (event_name === 'InitiateCheckout') ga4EventName = 'begin_checkout';
        else if (event_name === 'Purchase') ga4EventName = 'purchase';
        else if (event_name === 'Search') ga4EventName = 'search';
        else if (event_name === 'Contact') ga4EventName = 'generate_lead';

        const ga4Payload = {
          client_id: user_data.fbp || payloadEventId,
          user_id: user_data.phone ? normalizeAndHashPhone(user_data.phone) : (user_data.email ? hashMetaField(user_data.email) : (user_data.external_id ? hashMetaField(Array.isArray(user_data.external_id) ? user_data.external_id[0] : user_data.external_id) : undefined)),
          user_properties: {
            customer_city: user_data.city ? { value: user_data.city } : undefined,
            customer_state: (user_data.state || user_data.division) ? { value: user_data.state || user_data.division } : undefined,
            customer_country: { value: 'BD' },
          },
          events: [
            {
              name: ga4EventName,
              params: {
                currency: custom_data.currency || 'BDT',
                value: custom_data.value,
                transaction_id: custom_data.order_id || custom_data.transaction_id,
                shipping: custom_data.shipping,
                tax: custom_data.tax,
                coupon: custom_data.coupon,
                customer_name: (user_data.first_name || user_data.last_name || user_data.full_name) ? (user_data.full_name || `${user_data.first_name || ''} ${user_data.last_name || ''}`.trim()) : undefined,
                customer_phone_hash: user_data.phone ? normalizeAndHashPhone(user_data.phone) : undefined,
                items: custom_data.contents?.map((c: any) => ({
                  item_id: c.id,
                  item_name: c.title || c.content_name,
                  price: c.item_price,
                  quantity: c.quantity || 1,
                  item_category: c.category,
                })),
              },
            },
          ],
        };

        const ga4Res = await fetch(ga4Url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ga4Payload),
        });

        ga4ApiResponse = { status: ga4Res.status, ok: ga4Res.ok };
      } catch (ga4Err: any) {
        ga4ApiResponse = { error: ga4Err.message };
      }
    }

    eventCounts[event_name] = (eventCounts[event_name] || 0) + 1;

    const logEntry = {
      id: payloadEventId,
      eventName: event_name,
      eventId: payloadEventId,
      timestamp: new Date().toISOString(),
      sourceUrl: metaPayload.event_source_url,
      userDataSummary: {
        hasEmail: Boolean(user_data.email),
        hasPhone: Boolean(user_data.phone),
        hasName: Boolean(user_data.first_name || user_data.last_name || user_data.full_name || user_data.name),
        hasCity: Boolean(user_data.city),
        hasAddress: Boolean(user_data.address || user_data.street),
        hasState: Boolean(user_data.state || user_data.division),
        city: user_data.city,
        state: user_data.state || user_data.division,
        phonePreview: user_data.phone ? `${user_data.phone.substring(0, 3)}****${user_data.phone.slice(-3)}` : undefined,
        emailPreview: user_data.email ? `${user_data.email.split('@')[0].substring(0, 2)}***@${user_data.email.split('@')[1] || ''}` : undefined,
        fbp: user_data.fbp,
        fbc: user_data.fbc,
        clientIp: clientIp,
        userAgent: clientUserAgent.substring(0, 50) + '...',
      },
      customData: custom_data,
      status: dispatchStatus,
      metaResponse: metaApiResponse,
      ga4Response: ga4ApiResponse,
    };

    recentEvents.unshift(logEntry);
    if (recentEvents.length > 60) {
      recentEvents.pop();
    }

    return res.json({
      success: true,
      event_id: payloadEventId,
      event_name,
      status: dispatchStatus,
      dataset_id: datasetId ? `${datasetId.substring(0, 4)}***` : 'SANDBOX_ACTIVE',
      meta_response: metaApiResponse,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process tracking event', message: err.message });
  }
});

router.get('/tracking/dataset-status', (req: Request, res: Response) => {
  const datasetId = process.env.META_DATASET_ID || process.env.META_PIXEL_ID;
  const hasAccessToken = Boolean(process.env.META_ACCESS_TOKEN);

  res.json({
    configured: Boolean(datasetId && hasAccessToken),
    datasetId: datasetId ? `${datasetId.substring(0, 4)}***${datasetId.substring(datasetId.length - 3)}` : null,
    pixelId: process.env.VITE_META_PIXEL_ID || datasetId || null,
    isSandboxMode: !Boolean(datasetId && hasAccessToken),
    totalEventsTracked: Object.values(eventCounts).reduce((a, b) => a + b, 0),
    eventBreakdown: eventCounts,
    recentEvents: recentEvents.slice(0, 15),
  });
});

// Mount router on both /api (standard) and / (for Vercel path rewrites)
app.use('/api', router);
app.use('/', router);

// Explicit fallback handler for unhandled /api routes to prevent Vite/Static servers from returning 405 Method Not Allowed
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.url}`,
    method: req.method,
    url: req.url,
  });
});

export default app;
