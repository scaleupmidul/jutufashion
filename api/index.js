// src/server/app.ts
import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose3 from "mongoose";

// src/server/db.ts
import mongoose from "mongoose";
var cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null, lastError: null, connectedUri: null };
}
function getMongoUri() {
  const raw = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL || process.env.MONGODB_URL;
  if (!raw) return void 0;
  const cleaned = raw.trim().replace(/^["']|["']$/g, "");
  return cleaned.length > 0 ? cleaned : void 0;
}
async function connectToDatabase(overrideUri) {
  const uri = overrideUri || getMongoUri();
  if (!uri) {
    cached.lastError = "MongoDB URI is not configured";
    return {
      isConnected: false,
      error: cached.lastError,
      source: "local_database_file"
    };
  }
  if (mongoose.connection.readyState === 1 && cached.connectedUri === uri) {
    cached.conn = mongoose;
    cached.lastError = null;
    return { isConnected: true, source: "mongodb" };
  }
  if (overrideUri && cached.connectedUri && cached.connectedUri !== overrideUri) {
    try {
      await mongoose.disconnect();
    } catch {
    }
    cached.conn = null;
    cached.promise = null;
  }
  if (mongoose.connection.readyState === 2 && cached.promise) {
    try {
      cached.conn = await cached.promise;
      return { isConnected: true, source: "mongodb" };
    } catch (e) {
      cached.promise = null;
      cached.lastError = e.message;
      return { isConnected: false, error: e.message, source: "local_database_file" };
    }
  }
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 8e3,
      connectTimeoutMS: 8e3,
      socketTimeoutMS: 45e3,
      family: 4,
      // Force IPv4 to prevent IPv6 DNS timeout in cloud sandboxes
      retryWrites: true,
      w: "majority"
    };
    if (!uri.includes("mongodb.net/") || uri.match(/mongodb\.net\/\?/) || uri.match(/mongodb\.net\/$/)) {
      opts.dbName = "jutu_store";
    }
    console.log("\u{1F504} [MongoDB] Initiating connection to MongoDB Atlas...");
    cached.connectedUri = uri;
    cached.promise = mongoose.connect(uri, opts).then((m) => {
      const host = m.connection.host || "Atlas Cluster";
      const dbName = m.connection.name || "jutu_store";
      console.log(`\u2705 [MongoDB Atlas] Successfully connected to database "${dbName}" on host [${host}]`);
      cached.lastError = null;
      return m;
    }).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      cached.lastError = err.message;
      console.error("\u274C [MongoDB Atlas] Connection failed:", err.message);
      throw err;
    });
  }
  try {
    cached.conn = await cached.promise;
    cached.lastError = null;
    return { isConnected: true, source: "mongodb" };
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastError = e.message;
    return { isConnected: false, error: e.message, source: "local_database_file" };
  }
}
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
function getDbConnectionDiagnostics() {
  const uri = getMongoUri();
  const readyState = mongoose.connection.readyState;
  let stateName = "disconnected";
  if (readyState === 1) stateName = "connected";
  else if (readyState === 2) stateName = "connecting";
  else if (readyState === 3) stateName = "disconnecting";
  return {
    isConnected: readyState === 1,
    readyState,
    stateName,
    hasUriConfigured: Boolean(uri),
    databaseName: readyState === 1 ? mongoose.connection.name || "jutu_store" : null,
    lastError: cached.lastError
  };
}

// src/server/models.ts
import mongoose2, { Schema } from "mongoose";
var OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    date: { type: String },
    items: { type: Schema.Types.Mixed, default: [] },
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discountCode: { type: String },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    carbonOffsetKg: { type: Number, default: 0 },
    shippingAddress: { type: Schema.Types.Mixed, default: {} },
    shippingMethod: { type: Schema.Types.Mixed, default: {} },
    paymentMethod: { type: Schema.Types.Mixed, default: {} },
    paymentStatus: { type: String, default: "pending_advance" },
    advanceAmount: { type: Number, default: 0 },
    advanceAmountPaid: { type: Number, default: 0 },
    transactionId: { type: String },
    paymentProofUrl: { type: String },
    senderPhone: { type: String },
    status: { type: String, default: "pending", index: true },
    notes: { type: String },
    trackingNumber: { type: String },
    courier: { type: String },
    courierName: { type: String },
    adminNotes: { type: String }
  },
  {
    timestamps: true,
    strict: false
  }
);
var ProductSchema = new Schema(
  {
    id: { type: String, required: true, index: true },
    productId: { type: String, index: true },
    name: { type: String, required: true },
    subtitle: { type: String },
    category: { type: String, required: true, index: true },
    gender: { type: String, default: "unisex" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, default: 20 },
    isOutOfStock: { type: Boolean, default: false },
    badge: { type: String },
    description: { type: String, default: "" },
    materials: [{ type: String }],
    material: { type: String },
    features: [{ type: String }],
    idealFor: { type: String },
    buildQuality: { type: String },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 120 },
    colors: { type: Schema.Types.Mixed, default: [] },
    sizes: [{ type: Number }],
    isCustomCreated: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    strict: false
  }
);
var MessageSchema = new Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, default: "" },
    subject: { type: String, default: "Customer Inquiry" },
    message: { type: String, required: true },
    status: {
      type: String,
      default: "new",
      index: true
    },
    date: { type: String },
    notes: { type: String },
    adminNotes: { type: String }
  },
  {
    timestamps: true,
    strict: false
  }
);
var StoreSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: true
  }
);
var OrderModel = mongoose2.models.Order || mongoose2.model("Order", OrderSchema);
var ProductModel = mongoose2.models.Product || mongoose2.model("Product", ProductSchema);
var MessageModel = mongoose2.models.Message || mongoose2.model("Message", MessageSchema);
var StoreSettingsModel = mongoose2.models.StoreSettings || mongoose2.model("StoreSettings", StoreSettingsSchema);

// src/data/shoeImages.ts
var SHOE_IMAGES = {
  // 1. Women's Canvas Cruiser - Sea Spray (Light Blue canvas sneaker, white sole)
  canvasCruiserSeaSpray: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blueCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8bb1c5" />
          <stop offset="60%" stop-color="#7298ac" />
          <stop offset="100%" stop-color="#5f8396" />
        </linearGradient>
        <linearGradient id="blueCanvasDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#7298ac" />
          <stop offset="100%" stop-color="#56788b" />
        </linearGradient>
        <linearGradient id="whiteSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#f0ebe0" />
          <stop offset="100%" stop-color="#ded7cb" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#4a4036" />
        </filter>
      </defs>
      <g filter="url(#softShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#whiteSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 55,208 Q 240,218 458,205" fill="none" stroke="#e4ded3" stroke-width="1" />
        <path d="M 44,197 C 52,155 85,125 150,115 C 190,108 245,130 290,148 C 340,168 395,172 445,178 C 466,180 468,190 460,195 C 410,190 320,188 230,188 C 120,188 70,191 44,197 Z" fill="url(#blueCanvas)" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="url(#blueCanvasDark)" opacity="0.9" />
        <path d="M 92,108 C 110,122 135,120 152,118" fill="none" stroke="#9ec1d4" stroke-width="3" stroke-linecap="round" />
        <path d="M 160,116 C 195,128 238,145 285,153" fill="none" stroke="#63889b" stroke-width="8" stroke-linecap="round" />
        <circle cx="175" cy="122" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="198" cy="130" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="222" cy="138" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="246" cy="145" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="270" cy="151" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <path d="M 175,122 L 202,128 M 198,130 L 225,136 M 222,138 L 249,143 M 246,145 L 273,149" stroke="#92b8cb" stroke-width="3" stroke-linecap="round" />
        <path d="M 70,185 C 95,155 130,140 170,135" fill="none" stroke="#8cb2c5" stroke-width="1" stroke-dasharray="3,2" />
        <path d="M 150,118 C 220,150 320,170 435,178" fill="none" stroke="#8cb2c5" stroke-width="1" stroke-dasharray="3,2" />
        <path d="M 380,180 C 420,182 450,188 458,193" fill="none" stroke="#8cb2c5" stroke-width="1" stroke-dasharray="3,2" />
      </g>
    </svg>
  `)}`,
  // 2. Men's JUTU Slide - Anthracite (Charcoal grey knit strap, grey contoured sole)
  slideAnthracite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="anthraciteSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#555350" />
          <stop offset="45%" stop-color="#464442" />
          <stop offset="100%" stop-color="#343331" />
        </linearGradient>
        <linearGradient id="anthraciteStrap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6a6865" />
          <stop offset="50%" stop-color="#565451" />
          <stop offset="100%" stop-color="#41403e" />
        </linearGradient>
        <pattern id="knitTextureGrey" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="#62605d" opacity="0.6"/>
          <circle cx="4" cy="4" r="1" fill="#3a3937" />
        </pattern>
        <filter id="slideShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.14" flood-color="#2a2520" />
        </filter>
      </defs>
      <g filter="url(#slideShadow)">
        <path d="M 45,198 C 50,215 85,225 150,225 C 260,225 380,225 455,212 C 468,208 465,192 450,188 C 380,172 320,170 230,173 C 140,176 80,178 50,186 C 42,189 42,193 45,198 Z" fill="url(#anthraciteSole)" />
        <path d="M 52,216 Q 250,223 456,206" fill="none" stroke="#2e2d2b" stroke-width="2.5" />
        <path d="M 65,220 L 70,224 M 100,222 L 105,226 M 140,223 L 145,226 M 190,223 L 195,226 M 250,223 L 255,226 M 320,222 L 325,225 M 390,218 L 395,222 M 435,212 L 440,215" stroke="#2e2d2b" stroke-width="2" stroke-linecap="round" />
        <path d="M 50,186 C 85,178 140,175 225,173 C 315,170 380,172 448,188 C 435,183 370,177 235,177 C 130,177 75,182 50,186 Z" fill="#696764" opacity="0.6" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#anthraciteStrap)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#knitTextureGrey)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175" fill="none" stroke="#797672" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 152,174 C 185,165 240,162 338,174" fill="none" stroke="#373533" stroke-width="3" />
      </g>
    </svg>
  `)}`,
  // 3. Women's JUTU Flip Flop - Natural Black
  flipFlopBlack: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blackFlipSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#383838" />
          <stop offset="45%" stop-color="#2a2a2a" />
          <stop offset="100%" stop-color="#161616" />
        </linearGradient>
        <linearGradient id="blackThong" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3a3a3a" />
          <stop offset="60%" stop-color="#232323" />
          <stop offset="100%" stop-color="#121212" />
        </linearGradient>
        <pattern id="wovenBlack" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="3" fill="#2d2d2d"/>
          <rect y="3" width="6" height="3" fill="#181818"/>
        </pattern>
        <filter id="flipShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.15" flood-color="#222" />
        </filter>
      </defs>
      <g filter="url(#flipShadow)">
        <path d="M 50,196 C 55,212 90,222 160,222 C 270,222 375,222 452,210 C 465,206 462,192 448,188 C 380,172 320,171 230,173 C 140,175 85,178 55,185 C 47,188 47,192 50,196 Z" fill="url(#blackFlipSole)" />
        <path d="M 58,214 Q 250,221 448,205" fill="none" stroke="#111" stroke-width="2.5" />
        <path d="M 70,217 L 75,221 M 110,219 L 115,222 M 160,220 L 165,223 M 220,220 L 225,223 M 290,220 L 295,223 M 360,218 L 365,221 M 420,212 L 425,215" stroke="#111" stroke-width="2" stroke-linecap="round" />
        <path d="M 55,185 C 90,178 145,175 230,173 C 320,171 385,173 445,188 C 430,183 365,178 235,177 C 135,177 80,181 55,185 Z" fill="#4d4d4d" opacity="0.5" />
        <path d="M 320,173 L 312,128 L 328,128 Z" fill="#1f1f1f" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#blackThong)" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#wovenBlack)" opacity="0.7" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#blackThong)" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#wovenBlack)" opacity="0.7" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 355,140 375,160 388,180" fill="none" stroke="#505050" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 4. Men's JUTU Slide - Natural Black
  slideNaturalBlack: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blackSlideSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3d3d3d" />
          <stop offset="45%" stop-color="#292929" />
          <stop offset="100%" stop-color="#141414" />
        </linearGradient>
        <linearGradient id="blackStrap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#404040" />
          <stop offset="50%" stop-color="#282828" />
          <stop offset="100%" stop-color="#181818" />
        </linearGradient>
        <pattern id="knitTextureBlack" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="#353535" opacity="0.7"/>
          <circle cx="4" cy="4" r="1" fill="#111" />
        </pattern>
        <filter id="slideBlackShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.15" flood-color="#1a1a1a" />
        </filter>
      </defs>
      <g filter="url(#slideBlackShadow)">
        <path d="M 45,198 C 50,215 85,225 150,225 C 260,225 380,225 455,212 C 468,208 465,192 450,188 C 380,172 320,170 230,173 C 140,176 80,178 50,186 C 42,189 42,193 45,198 Z" fill="url(#blackSlideSole)" />
        <path d="M 52,216 Q 250,223 456,206" fill="none" stroke="#0f0f0f" stroke-width="2.5" />
        <path d="M 65,220 L 70,224 M 100,222 L 105,226 M 140,223 L 145,226 M 190,223 L 195,226 M 250,223 L 255,226 M 320,222 L 325,225 M 390,218 L 395,222 M 435,212 L 440,215" stroke="#0f0f0f" stroke-width="2" stroke-linecap="round" />
        <path d="M 50,186 C 85,178 140,175 225,173 C 315,170 380,172 448,188 C 435,183 370,177 235,177 C 130,177 75,182 50,186 Z" fill="#525252" opacity="0.6" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#blackStrap)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#knitTextureBlack)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175" fill="none" stroke="#525252" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 152,174 C 185,165 240,162 338,174" fill="none" stroke="#181818" stroke-width="3" />
      </g>
    </svg>
  `)}`,
  // 5. Women's JUTU Slide - Sand
  slideSand: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="sandSlideSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ded4c5" />
          <stop offset="45%" stop-color="#ccbfae" />
          <stop offset="100%" stop-color="#b4a694" />
        </linearGradient>
        <linearGradient id="sandStrap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e3dbcd" />
          <stop offset="50%" stop-color="#d1c6b5" />
          <stop offset="100%" stop-color="#b8ab99" />
        </linearGradient>
        <pattern id="knitTextureSand" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="#ded5c6" opacity="0.6"/>
          <circle cx="4" cy="4" r="1" fill="#aa9c8b" />
        </pattern>
        <filter id="slideSandShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#5a4e3e" />
        </filter>
      </defs>
      <g filter="url(#slideSandShadow)">
        <path d="M 45,198 C 50,215 85,225 150,225 C 260,225 380,225 455,212 C 468,208 465,192 450,188 C 380,172 320,170 230,173 C 140,176 80,178 50,186 C 42,189 42,193 45,198 Z" fill="url(#sandSlideSole)" />
        <path d="M 52,216 Q 250,223 456,206" fill="none" stroke="#9e917f" stroke-width="2.5" />
        <path d="M 65,220 L 70,224 M 100,222 L 105,226 M 140,223 L 145,226 M 190,223 L 195,226 M 250,223 L 255,226 M 320,222 L 325,225 M 390,218 L 395,222 M 435,212 L 440,215" stroke="#9e917f" stroke-width="2" stroke-linecap="round" />
        <path d="M 50,186 C 85,178 140,175 225,173 C 315,170 380,172 448,188 C 435,183 370,177 235,177 C 130,177 75,182 50,186 Z" fill="#ede5d8" opacity="0.8" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#sandStrap)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#knitTextureSand)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175" fill="none" stroke="#ece4d6" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 152,174 C 185,165 240,162 338,174" fill="none" stroke="#a49683" stroke-width="3" />
      </g>
    </svg>
  `)}`,
  // 6. Women's & Men's JUTU Flip Flop - Sand
  flipFlopSand: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="sandFlipSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ded4c5" />
          <stop offset="45%" stop-color="#ccbfae" />
          <stop offset="100%" stop-color="#b4a694" />
        </linearGradient>
        <linearGradient id="sandThong" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e3dbcd" />
          <stop offset="60%" stop-color="#cfc4b3" />
          <stop offset="100%" stop-color="#b5a796" />
        </linearGradient>
        <pattern id="wovenSand" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="3" fill="#d9cebd"/>
          <rect y="3" width="6" height="3" fill="#c0b3a1"/>
        </pattern>
        <filter id="flipSandShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#5a4e3e" />
        </filter>
      </defs>
      <g filter="url(#flipSandShadow)">
        <path d="M 50,196 C 55,212 90,222 160,222 C 270,222 375,222 452,210 C 465,206 462,192 448,188 C 380,172 320,171 230,173 C 140,175 85,178 55,185 C 47,188 47,192 50,196 Z" fill="url(#sandFlipSole)" />
        <path d="M 58,214 Q 250,221 448,205" fill="none" stroke="#9e917f" stroke-width="2.5" />
        <path d="M 70,217 L 75,221 M 110,219 L 115,222 M 160,220 L 165,223 M 220,220 L 225,223 M 290,220 L 295,223 M 360,218 L 365,221 M 420,212 L 425,215" stroke="#9e917f" stroke-width="2" stroke-linecap="round" />
        <path d="M 55,185 C 90,178 145,175 230,173 C 320,171 385,173 445,188 C 430,183 365,178 235,177 C 135,177 80,181 55,185 Z" fill="#ede5d8" opacity="0.8" />
        <path d="M 320,173 L 312,128 L 328,128 Z" fill="#b9ab99" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#sandThong)" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#wovenSand)" opacity="0.7" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#sandThong)" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#wovenSand)" opacity="0.7" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 355,140 375,160 388,180" fill="none" stroke="#ede5d8" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 7. Women's Canvas Cruiser Slip On - Warm White
  canvasCruiserSlipOnWarmWhite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="warmWhiteCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="50%" stop-color="#f0ebe0" />
          <stop offset="100%" stop-color="#e2dacf" />
        </linearGradient>
        <linearGradient id="warmWhiteSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ebe5d8" />
          <stop offset="100%" stop-color="#ded6c7" />
        </linearGradient>
        <filter id="slipOnShadow1" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.1" flood-color="#4a4036" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow1)">
        <path d="M 45,212 C 60,225 120,232 220,232 C 350,232 445,225 465,210 C 472,205 470,193 458,191 C 420,186 360,185 240,185 C 120,185 70,188 40,195 C 34,197 36,204 45,212 Z" fill="url(#warmWhiteSole)" stroke="#dcd4c5" stroke-width="1.5" />
        <path d="M 50,206 Q 240,216 458,203" fill="none" stroke="#dcd4c5" stroke-width="1" />
        <path d="M 42,196 C 50,152 82,120 150,110 C 185,105 235,125 275,142 C 325,162 385,166 438,172 C 460,175 464,186 456,192 C 410,187 320,186 230,186 C 120,186 68,190 42,196 Z" fill="url(#warmWhiteCanvas)" />
        <path d="M 42,194 C 40,165 52,126 88,105 C 108,94 130,97 145,115 C 138,138 120,160 92,178 C 70,188 52,193 42,194 Z" fill="#e5ded2" opacity="0.8" />
        <path d="M 88,105 C 105,118 128,116 145,115" fill="none" stroke="#d5ccc0" stroke-width="3" stroke-linecap="round" />
        <path d="M 148,114 C 158,124 168,142 172,154 L 160,156 C 155,144 146,128 138,118 Z" fill="#d2c9bd" />
        <path d="M 148,114 L 160,156 M 153,116 L 165,155" stroke="#b8ad9f" stroke-width="1" />
        <path d="M 145,115 C 215,145 315,165 430,173" fill="none" stroke="#d8cfc3" stroke-width="1" stroke-dasharray="3,2" />
      </g>
    </svg>
  `)}`,
  // 8. Women's Cruiser Slip On - Blizzard (Crisp White Textured Knit)
  cruiserSlipOnBlizzard: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blizzardWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#fafafa" />
          <stop offset="100%" stop-color="#eeeeee" />
        </linearGradient>
        <pattern id="knitDiamond" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3 L3 0 L6 3 L3 6 Z" fill="#f0f0f0"/>
        </pattern>
        <filter id="slipOnShadow2" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.09" flood-color="#444" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow2)">
        <path d="M 45,212 C 60,225 120,232 220,232 C 350,232 445,225 465,210 C 472,205 470,193 458,191 C 420,186 360,185 240,185 C 120,185 70,188 40,195 C 34,197 36,204 45,212 Z" fill="#ffffff" stroke="#e0e0e0" stroke-width="1.5" />
        <path d="M 50,206 Q 240,216 458,203" fill="none" stroke="#e8e8e8" stroke-width="1" />
        <path d="M 42,196 C 50,152 82,120 150,110 C 185,105 235,125 275,142 C 325,162 385,166 438,172 C 460,175 464,186 456,192 C 410,187 320,186 230,186 C 120,186 68,190 42,196 Z" fill="url(#blizzardWhite)" />
        <path d="M 42,196 C 50,152 82,120 150,110 C 185,105 235,125 275,142 C 325,162 385,166 438,172 C 460,175 464,186 456,192 C 410,187 320,186 230,186 C 120,186 68,190 42,196 Z" fill="url(#knitDiamond)" opacity="0.6" />
        <path d="M 42,194 C 40,165 52,126 88,105 C 108,94 130,97 145,115 C 138,138 120,160 92,178 C 70,188 52,193 42,194 Z" fill="#f5f5f5" />
        <path d="M 88,105 C 105,118 128,116 145,115" fill="none" stroke="#e0e0e0" stroke-width="3" stroke-linecap="round" />
        <path d="M 148,114 C 158,124 168,142 172,154 L 160,156 C 155,144 146,128 138,118 Z" fill="#e8e8e8" />
      </g>
    </svg>
  `)}`,
  // 9. Women's Runner NZ Slip On - Mushroom
  runnerSlipOnMushroom: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="mushroomKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#cfc4b3" />
          <stop offset="50%" stop-color="#bbaea0" />
          <stop offset="100%" stop-color="#a49688" />
        </linearGradient>
        <linearGradient id="mushroomSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#cfc3b3" />
          <stop offset="50%" stop-color="#baad9c" />
          <stop offset="100%" stop-color="#a89a87" />
        </linearGradient>
        <filter id="slipOnShadow3" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#4a3e30" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow3)">
        <path d="M 50,210 C 65,225 130,230 220,228 C 340,226 430,215 455,200 C 462,195 458,185 448,183 C 400,178 340,178 240,180 C 130,182 75,188 45,196 C 40,198 42,204 50,210 Z" fill="url(#mushroomSole)" />
        <path d="M 45,196 C 52,148 100,110 170,95 C 210,88 260,110 305,130 C 355,152 405,158 440,168 C 456,172 458,182 450,186 C 400,180 320,180 230,180 C 120,180 70,188 45,196 Z" fill="url(#mushroomKnit)" />
        <path d="M 125,82 C 128,70 135,70 138,82 L 138,98 L 125,98 Z" fill="none" stroke="#948473" stroke-width="3" stroke-linecap="round" />
        <path d="M 115,102 C 128,88 152,88 170,95 C 162,118 145,135 125,148 C 110,140 108,120 115,102 Z" fill="#a99a89" />
        <path d="M 115,102 C 128,88 152,88 170,95" fill="none" stroke="#948473" stroke-width="2.5" />
        <path d="M 130,135 Q 165,115 200,120 Q 235,128 270,145" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 140,148 Q 180,125 220,132 Q 260,140 300,155" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 155,160 Q 200,138 245,145 Q 290,152 335,163" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 175,170 Q 225,150 275,155 Q 325,162 375,170" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 205,176 Q 255,160 305,165 Q 355,170 410,174" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 10. Women's Runner NZ Slip On - Anthracite
  runnerSlipOnAnthracite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="anthraciteKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#55524e" />
          <stop offset="50%" stop-color="#423f3c" />
          <stop offset="100%" stop-color="#2d2b29" />
        </linearGradient>
        <linearGradient id="anthraciteSoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4d4a46" />
          <stop offset="50%" stop-color="#3b3835" />
          <stop offset="100%" stop-color="#282624" />
        </linearGradient>
        <filter id="slipOnShadow4" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.15" flood-color="#111" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow4)">
        <path d="M 50,210 C 65,225 130,230 220,228 C 340,226 430,215 455,200 C 462,195 458,185 448,183 C 400,178 340,178 240,180 C 130,182 75,188 45,196 C 40,198 42,204 50,210 Z" fill="url(#anthraciteSoleGrad)" />
        <path d="M 45,196 C 52,148 100,110 170,95 C 210,88 260,110 305,130 C 355,152 405,158 440,168 C 456,172 458,182 450,186 C 400,180 320,180 230,180 C 120,180 70,188 45,196 Z" fill="url(#anthraciteKnit)" />
        <path d="M 125,82 C 128,70 135,70 138,82 L 138,98 L 125,98 Z" fill="none" stroke="#66625d" stroke-width="3" stroke-linecap="round" />
        <path d="M 115,102 C 128,88 152,88 170,95 C 162,118 145,135 125,148 C 110,140 108,120 115,102 Z" fill="#3b3936" />
        <path d="M 115,102 C 128,88 152,88 170,95" fill="none" stroke="#5a5651" stroke-width="2.5" />
        <path d="M 130,135 Q 165,115 200,120 Q 235,128 270,145" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 140,148 Q 180,125 220,132 Q 260,140 300,155" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 155,160 Q 200,138 245,145 Q 290,152 335,163" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 175,170 Q 225,150 275,155 Q 325,162 375,170" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 205,176 Q 255,160 305,165 Q 355,170 410,174" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 11. Women's Runner NZ Slip On - Dark Navy
  runnerSlipOnDarkNavy: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="navyKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a3342" />
          <stop offset="50%" stop-color="#1b2230" />
          <stop offset="100%" stop-color="#101520" />
        </linearGradient>
        <linearGradient id="navySoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#232a38" />
          <stop offset="50%" stop-color="#161c28" />
          <stop offset="100%" stop-color="#0d111a" />
        </linearGradient>
        <filter id="slipOnShadow5" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.16" flood-color="#0a0d14" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow5)">
        <path d="M 50,210 C 65,225 130,230 220,228 C 340,226 430,215 455,200 C 462,195 458,185 448,183 C 400,178 340,178 240,180 C 130,182 75,188 45,196 C 40,198 42,204 50,210 Z" fill="url(#navySoleGrad)" />
        <path d="M 45,196 C 52,148 100,110 170,95 C 210,88 260,110 305,130 C 355,152 405,158 440,168 C 456,172 458,182 450,186 C 400,180 320,180 230,180 C 120,180 70,188 45,196 Z" fill="url(#navyKnit)" />
        <path d="M 125,82 C 128,70 135,70 138,82 L 138,98 L 125,98 Z" fill="none" stroke="#37455c" stroke-width="3" stroke-linecap="round" />
        <path d="M 115,102 C 128,88 152,88 170,95 C 162,118 145,135 125,148 C 110,140 108,120 115,102 Z" fill="#18202d" />
        <path d="M 115,102 C 128,88 152,88 170,95" fill="none" stroke="#2d394d" stroke-width="2.5" />
        <path d="M 130,135 Q 165,115 200,120 Q 235,128 270,145" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 140,148 Q 180,125 220,132 Q 260,140 300,155" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 155,160 Q 200,138 245,145 Q 290,152 335,163" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 175,170 Q 225,150 275,155 Q 325,162 375,170" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 205,176 Q 255,160 305,165 Q 355,170 410,174" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 12. Men's Tree Dasher 2 - Sage Green (Athletic running shoe with laces & performance sole)
  dasherSageGreen: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="sageKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8ba192" />
          <stop offset="60%" stop-color="#6d8073" />
          <stop offset="100%" stop-color="#546559" />
        </linearGradient>
        <linearGradient id="dasherSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f0efe9" />
          <stop offset="100%" stop-color="#d9d7ce" />
        </linearGradient>
        <filter id="dasherShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#3c4a40" />
        </filter>
      </defs>
      <g filter="url(#dasherShadow)">
        <path d="M 45,214 C 60,228 130,235 230,234 C 350,233 440,222 468,206 C 475,200 470,188 456,186 C 410,180 340,180 235,182 C 120,184 70,189 40,196 C 34,198 36,206 45,214 Z" fill="url(#dasherSole)" stroke="#dedcd3" stroke-width="1.5" />
        <path d="M 44,197 C 52,148 95,115 160,105 C 205,98 255,122 298,142 C 345,164 398,168 446,176 C 465,178 468,189 458,194 C 410,188 320,186 230,186 C 120,186 70,191 44,197 Z" fill="url(#sageKnit)" />
        <path d="M 160,108 C 200,122 245,140 290,148" fill="none" stroke="#5a6c60" stroke-width="6" stroke-linecap="round" />
        <circle cx="178" cy="116" r="3.5" fill="#f4f4f0" />
        <circle cx="204" cy="125" r="3.5" fill="#f4f4f0" />
        <circle cx="230" cy="133" r="3.5" fill="#f4f4f0" />
        <circle cx="256" cy="140" r="3.5" fill="#f4f4f0" />
        <path d="M 178,116 L 208,123 M 204,125 L 234,131 M 230,133 L 260,138" stroke="#48574c" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,125 90,105 C 112,94 135,97 150,116 C 142,138 122,160 92,180 C 70,190 52,195 45,195 Z" fill="#5b6c5f" opacity="0.8" />
      </g>
    </svg>
  `)}`,
  // 13. Women's Tree Runner - Mist Blue (Iconic everyday sneaker)
  treeRunnerMistBlue: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="mistKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#93afbc" />
          <stop offset="60%" stop-color="#7895a2" />
          <stop offset="100%" stop-color="#5f7b88" />
        </linearGradient>
        <linearGradient id="mistSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ede7db" />
          <stop offset="100%" stop-color="#ded6c6" />
        </linearGradient>
        <filter id="mistShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#3b4d56" />
        </filter>
      </defs>
      <g filter="url(#mistShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#mistSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,152 88,122 152,112 C 192,105 242,128 288,145 C 338,165 392,170 442,176 C 462,178 466,189 458,194 C 410,189 320,187 230,187 C 120,187 70,191 44,197 Z" fill="url(#mistKnit)" />
        <circle cx="172" cy="120" r="3.5" fill="#f0f5f8" />
        <circle cx="196" cy="128" r="3.5" fill="#f0f5f8" />
        <circle cx="220" cy="135" r="3.5" fill="#f0f5f8" />
        <circle cx="244" cy="142" r="3.5" fill="#f0f5f8" />
        <circle cx="268" cy="148" r="3.5" fill="#f0f5f8" />
        <path d="M 172,120 L 200,126 M 196,128 L 224,133 M 220,135 L 248,140 M 244,142 L 272,146" stroke="#9bbccc" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="#658391" opacity="0.8" />
      </g>
    </svg>
  `)}`,
  // 14. Wool Lounger - Dapple Grey (Cozy slip-on loafer)
  woolLoungerDappleGrey: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="dappleWool" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#969696" />
          <stop offset="50%" stop-color="#7a7a7a" />
          <stop offset="100%" stop-color="#616161" />
        </linearGradient>
        <linearGradient id="loungerSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#eae5da" />
          <stop offset="100%" stop-color="#dad4c7" />
        </linearGradient>
        <filter id="loungerShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#333" />
        </filter>
      </defs>
      <g filter="url(#loungerShadow)">
        <path d="M 45,212 C 60,225 120,232 220,232 C 350,232 445,225 465,210 C 472,205 470,193 458,191 C 420,186 360,185 240,185 C 120,185 70,188 40,195 C 34,197 36,204 45,212 Z" fill="url(#loungerSole)" stroke="#dcd4c5" stroke-width="1.5" />
        <path d="M 42,196 C 50,152 82,118 150,108 C 185,103 235,123 275,140 C 325,160 385,165 438,171 C 460,174 464,185 456,191 C 410,186 320,185 230,185 C 120,185 68,189 42,196 Z" fill="url(#dappleWool)" />
        <path d="M 42,194 C 40,165 52,126 88,105 C 108,94 130,97 145,115 C 138,138 120,160 92,178 C 70,188 52,193 42,194 Z" fill="#696969" opacity="0.8" />
        <path d="M 88,105 C 105,118 128,116 145,115" fill="none" stroke="#a0a0a0" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 15. Men's Tree Piper - Chalk White
  treePiperChalkWhite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="piperWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f5f2eb" />
          <stop offset="100%" stop-color="#e8e4d8" />
        </linearGradient>
        <linearGradient id="piperSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ede7db" />
          <stop offset="100%" stop-color="#ddd5c5" />
        </linearGradient>
        <filter id="piperShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.1" flood-color="#4a4036" />
        </filter>
      </defs>
      <g filter="url(#piperShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#piperSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,155 85,125 150,115 C 190,108 245,130 290,148 C 340,168 395,172 445,178 C 466,180 468,190 460,195 C 410,190 320,188 230,188 C 120,188 70,191 44,197 Z" fill="url(#piperWhite)" />
        <circle cx="175" cy="122" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="198" cy="130" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="222" cy="138" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="246" cy="145" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="270" cy="151" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <path d="M 175,122 L 202,128 M 198,130 L 225,136 M 222,138 L 249,143 M 246,145 L 273,149" stroke="#cfc7b6" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="#eae4d8" opacity="0.9" />
      </g>
    </svg>
  `)}`,
  // 16. Women's Wool Runner Mizzle - Storm Grey (Weather-resistant)
  woolRunnerMizzleGrey: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="stormKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#707a84" />
          <stop offset="60%" stop-color="#5a626a" />
          <stop offset="100%" stop-color="#444b52" />
        </linearGradient>
        <linearGradient id="mizzleSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#e8e5dc" />
          <stop offset="100%" stop-color="#d5d0c4" />
        </linearGradient>
        <filter id="mizzleShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.13" flood-color="#2a3036" />
        </filter>
      </defs>
      <g filter="url(#mizzleShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#mizzleSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,152 88,122 152,112 C 192,105 242,128 288,145 C 338,165 392,170 442,176 C 462,178 466,189 458,194 C 410,189 320,187 230,187 C 120,187 70,191 44,197 Z" fill="url(#stormKnit)" />
        <circle cx="172" cy="120" r="3.5" fill="#f0f5f8" />
        <circle cx="196" cy="128" r="3.5" fill="#f0f5f8" />
        <circle cx="220" cy="135" r="3.5" fill="#f0f5f8" />
        <circle cx="244" cy="142" r="3.5" fill="#f0f5f8" />
        <circle cx="268" cy="148" r="3.5" fill="#f0f5f8" />
        <path d="M 172,120 L 200,126 M 196,128 L 224,133 M 220,135 L 248,140 M 244,142 L 272,146" stroke="#484f55" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="#4d545b" opacity="0.8" />
      </g>
    </svg>
  `)}`,
  // 17. Men's Trail Runner SWT - Forest Green (Deep lug off-road trainer)
  trailRunnerSWTGreen: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="forestKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4d6350" />
          <stop offset="60%" stop-color="#3b4d3c" />
          <stop offset="100%" stop-color="#283529" />
        </linearGradient>
        <linearGradient id="trailSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e3dbcc" />
          <stop offset="50%" stop-color="#d0c6b3" />
          <stop offset="100%" stop-color="#44413b" />
        </linearGradient>
        <filter id="trailShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.14" flood-color="#212a22" />
        </filter>
      </defs>
      <g filter="url(#trailShadow)">
        <path d="M 45,214 C 60,228 130,235 230,234 C 350,233 440,222 468,206 C 475,200 470,188 456,186 C 410,180 340,180 235,182 C 120,184 70,189 40,196 C 34,198 36,206 45,214 Z" fill="url(#trailSole)" />
        <path d="M 44,197 C 52,148 95,115 160,105 C 205,98 255,122 298,142 C 345,164 398,168 446,176 C 465,178 468,189 458,194 C 410,188 320,186 230,186 C 120,186 70,191 44,197 Z" fill="url(#forestKnit)" />
        <path d="M 160,108 C 200,122 245,140 290,148" fill="none" stroke="#253226" stroke-width="6" stroke-linecap="round" />
        <circle cx="178" cy="116" r="3.5" fill="#f4f4f0" />
        <circle cx="204" cy="125" r="3.5" fill="#f4f4f0" />
        <circle cx="230" cy="133" r="3.5" fill="#f4f4f0" />
        <circle cx="256" cy="140" r="3.5" fill="#f4f4f0" />
        <path d="M 178,116 L 208,123 M 204,125 L 234,131 M 230,133 L 260,138" stroke="#1f2920" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 18. Women's Tree Breezer Flat - Jet Black (Silky ballet flat)
  treeBreezerJetBlack: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="breezerBlack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#363636" />
          <stop offset="60%" stop-color="#212121" />
          <stop offset="100%" stop-color="#121212" />
        </linearGradient>
        <linearGradient id="flatSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3d3d3d" />
          <stop offset="100%" stop-color="#1a1a1a" />
        </linearGradient>
        <filter id="flatShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity="0.15" flood-color="#111" />
        </filter>
      </defs>
      <g filter="url(#flatShadow)">
        <path d="M 50,214 C 65,224 125,230 220,230 C 350,230 440,224 460,212 C 466,208 464,198 454,196 C 420,192 360,190 240,190 C 120,190 70,193 45,198 C 40,200 42,206 50,214 Z" fill="url(#flatSole)" stroke="#222" stroke-width="1.5" />
        <path d="M 45,198 C 50,165 75,138 120,132 C 160,126 210,146 255,160 C 305,176 365,178 430,183 C 452,185 456,193 450,197 C 410,194 320,193 230,193 C 120,193 70,195 45,198 Z" fill="url(#breezerBlack)" />
        <path d="M 120,132 C 180,126 270,140 375,182" fill="none" stroke="#4f4f4f" stroke-width="2.5" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 19. Women's Tree Flyer Training - Lavender Mist
  treeFlyerLavender: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="lavenderKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b6a9c2" />
          <stop offset="60%" stop-color="#988ca3" />
          <stop offset="100%" stop-color="#7a6f84" />
        </linearGradient>
        <linearGradient id="flyerSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f2edf7" />
          <stop offset="100%" stop-color="#ded4e6" />
        </linearGradient>
        <filter id="flyerShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#4a4052" />
        </filter>
      </defs>
      <g filter="url(#flyerShadow)">
        <path d="M 45,214 C 60,228 130,235 230,234 C 350,233 440,222 468,206 C 475,200 470,188 456,186 C 410,180 340,180 235,182 C 120,184 70,189 40,196 C 34,198 36,206 45,214 Z" fill="url(#flyerSole)" stroke="#dcd4e4" stroke-width="1.5" />
        <path d="M 44,197 C 52,148 95,115 160,105 C 205,98 255,122 298,142 C 345,164 398,168 446,176 C 465,178 468,189 458,194 C 410,188 320,186 230,186 C 120,186 70,191 44,197 Z" fill="url(#lavenderKnit)" />
        <circle cx="178" cy="116" r="3.5" fill="#faf8fc" />
        <circle cx="204" cy="125" r="3.5" fill="#faf8fc" />
        <circle cx="230" cy="133" r="3.5" fill="#faf8fc" />
        <circle cx="256" cy="140" r="3.5" fill="#faf8fc" />
        <path d="M 178,116 L 208,123 M 204,125 L 234,131 M 230,133 L 260,138" stroke="#7e7189" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
  // 20. Men's Tree Runner Breeze - Salt White
  treeRunnerBreezeWhite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="breezeWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#faf9f6" />
          <stop offset="100%" stop-color="#eeebe2" />
        </linearGradient>
        <linearGradient id="breezeSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ede7dc" />
          <stop offset="100%" stop-color="#ddd5c7" />
        </linearGradient>
        <filter id="breezeShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.1" flood-color="#444" />
        </filter>
      </defs>
      <g filter="url(#breezeShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#breezeSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,152 88,122 152,112 C 192,105 242,128 288,145 C 338,165 392,170 442,176 C 462,178 466,189 458,194 C 410,189 320,187 230,187 C 120,187 70,191 44,197 Z" fill="url(#breezeWhite)" />
        <circle cx="172" cy="120" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <circle cx="196" cy="128" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <circle cx="220" cy="135" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <circle cx="244" cy="142" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <path d="M 172,120 L 200,126 M 196,128 L 224,133 M 220,135 L 248,140" stroke="#d5cebe" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`
};
var SHOE_PRESETS = [
  { label: "Breeze - Salt White", url: SHOE_IMAGES.treeRunnerBreezeWhite },
  { label: "Cruiser - Sea Spray Blue", url: SHOE_IMAGES.canvasCruiserSeaSpray },
  { label: "Cruiser - Warm White", url: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite },
  { label: "Cruiser - Blizzard White", url: SHOE_IMAGES.cruiserSlipOnBlizzard },
  { label: "Dasher - Sage Green", url: SHOE_IMAGES.dasherSageGreen },
  { label: "Runner - Mist Blue", url: SHOE_IMAGES.treeRunnerMistBlue },
  { label: "Runner - Mushroom Beige", url: SHOE_IMAGES.runnerSlipOnMushroom },
  { label: "Runner - Anthracite Grey", url: SHOE_IMAGES.runnerSlipOnAnthracite },
  { label: "Runner - Dark Navy", url: SHOE_IMAGES.runnerSlipOnDarkNavy },
  { label: "Runner - Storm Grey", url: SHOE_IMAGES.woolRunnerMizzleGrey },
  { label: "Piper - Chalk White", url: SHOE_IMAGES.treePiperChalkWhite },
  { label: "Trail - Forest Green", url: SHOE_IMAGES.trailRunnerSWTGreen },
  { label: "Lounger - Dapple Grey", url: SHOE_IMAGES.woolLoungerDappleGrey },
  { label: "Breezer - Jet Black", url: SHOE_IMAGES.treeBreezerJetBlack },
  { label: "Flyer - Lavender Mist", url: SHOE_IMAGES.treeFlyerLavender },
  { label: "Slide - Anthracite Grey", url: SHOE_IMAGES.slideAnthracite },
  { label: "Slide - Sand Tan", url: SHOE_IMAGES.slideSand },
  { label: "Slide - Natural Black", url: SHOE_IMAGES.slideNaturalBlack },
  { label: "Flip Flop - Sand Tan", url: SHOE_IMAGES.flipFlopSand },
  { label: "Flip Flop - Natural Black", url: SHOE_IMAGES.flipFlopBlack }
];

// src/data/products.ts
var PRODUCTS = [
  // 1. Women's Canvas Cruiser - Sea Spray
  {
    id: "262364",
    name: "WOMEN'S CANVAS CRUISER",
    subtitle: "Classic retro canvas silhouette upgraded with modern cushion comfort.",
    category: "cruisers",
    gender: "women",
    price: 2850,
    badge: "New",
    colors: [
      {
        name: "Sea Spray",
        colorCode: "#7298ac",
        image: SHOE_IMAGES.canvasCruiserSeaSpray,
        altImages: [
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80"
        ]
      },
      {
        name: "Warm White",
        colorCode: "#ebe6dc",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Port",
        colorCode: "#662234",
        image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Jet Black",
        colorCode: "#222222",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80"
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "A timeless low-profile sneaker crafted from heavy-duty breathable cotton canvas and anti-slip vulcanized rubber sole. Lightweight, breezy, and effortlessly paired with any casual outfit.",
    materials: [
      "Heavy-duty breathable cotton canvas upper",
      "Anti-slip vulcanized rubber outsole with waffle grip",
      "High-resilience cushioned insole with arch support",
      "Reinforced double-stitched eyelets and seams"
    ],
    features: [
      "Ultra-breathable lightweight design",
      "Flexible shock-absorbing sole",
      "Removable cushioned insole for easy washing"
    ],
    idealFor: "Daily Casual, College & City Walking",
    buildQuality: "Premium Grade Canvas & Rubber",
    rating: 4.8,
    reviewCount: 980
  },
  // 2. Men's JUTU Slide - Anthracite
  {
    id: "262361",
    name: "MEN'S JUTU SLIDE",
    subtitle: "Ultra-cushioned textured slip-on slide engineered for maximum comfort and foot recovery.",
    category: "slides",
    gender: "men",
    price: 1650,
    badge: "New",
    colors: [
      {
        name: "Anthracite",
        colorCode: "#464442",
        image: SHOE_IMAGES.slideAnthracite
      },
      {
        name: "Natural Black",
        colorCode: "#1a1a1a",
        image: SHOE_IMAGES.slideNaturalBlack
      },
      {
        name: "Sand",
        colorCode: "#c8bcab",
        image: SHOE_IMAGES.slideSand
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "The easiest slide you will ever own. Built with a supportive contoured footbed that reduces foot fatigue, paired with a soft padded strap for all-day comfort.",
    materials: [
      "High-elasticity shock-absorbing EVA foam footbed",
      "Padded quick-dry strap with soft inner lining",
      "Water-resistant textured non-slip outsole",
      "Ergonomic toe bar and deep heel cup"
    ],
    features: [
      "Ergonomic arch support for pressure relief",
      "Water-friendly, washable & quick-drying",
      "High-traction ribbed non-slip sole"
    ],
    idealFor: "Home Lounging, Post-Workout & Travel",
    buildQuality: "High-Density Injection Molded EVA",
    rating: 4.8,
    reviewCount: 512
  },
  // 3. Women's JUTU Flip Flop - Natural Black
  {
    id: "262362",
    name: "WOMEN'S JUTU FLIP FLOP",
    subtitle: "Featherlight cushioned thong sandal with cloud-like arch support.",
    category: "slides",
    gender: "women",
    price: 1350,
    badge: "New",
    colors: [
      {
        name: "Natural Black",
        colorCode: "#1f1f1f",
        image: SHOE_IMAGES.flipFlopBlack
      },
      {
        name: "Sand",
        colorCode: "#c2b4a1",
        image: SHOE_IMAGES.flipFlopSand
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Lightweight flip flops designed with super soft anti-chafe toe straps and a shock-absorbing textured footbed for smooth, pain-free daily steps.",
    materials: [
      "High-resilience soft foam cushion sole",
      "Soft woven anti-chafe toe post strap",
      "Textured anti-slip grip pattern on footbed & sole",
      "Flexible lightweight contoured base"
    ],
    features: [
      "Zero-chafe woven toe post (no blisters)",
      "Contoured footbed cradles your feet",
      "Easy to rinse and water-resistant"
    ],
    idealFor: "Everyday Casual, Beach & Home Wear",
    buildQuality: "Comfort Foam & Reinforced Webbing",
    rating: 4.9,
    reviewCount: 780
  },
  // 4. Men's JUTU Slide - Natural Black
  {
    id: "262363",
    name: "MEN'S JUTU SLIDE",
    subtitle: "Classic black everyday slide for recovery, lounging, and street comfort.",
    category: "slides",
    gender: "men",
    price: 1650,
    badge: "New",
    colors: [
      {
        name: "Natural Black",
        colorCode: "#181818",
        image: SHOE_IMAGES.slideNaturalBlack
      },
      {
        name: "Anthracite",
        colorCode: "#464442",
        image: SHOE_IMAGES.slideAnthracite
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Slip into instant comfort with our shock-absorbing cushioned slide sandals. Features a wide ergonomic upper band and anti-skid bottom tread.",
    materials: [
      "Dual-density cushioning EVA midsole",
      "Soft padded comfort band with reinforced border",
      "Deep grooved anti-slip grip outsole"
    ],
    features: [
      "Deep shock-absorbing cushion",
      "Wide supportive strap with snug fit",
      "Anti-slip tread for wet & dry surfaces"
    ],
    idealFor: "Daily Casual Lounging & Outdoor Relax",
    buildQuality: "High-Durability Molded EVA",
    rating: 4.8,
    reviewCount: 390
  },
  // 5. Women's JUTU Slide - Sand
  {
    id: "262365",
    name: "WOMEN'S JUTU SLIDE",
    subtitle: "Subtle earthy tones with plush cushioning for all-day easy steps.",
    category: "slides",
    gender: "women",
    price: 1650,
    badge: "New",
    colors: [
      {
        name: "Sand",
        colorCode: "#c8bcab",
        image: SHOE_IMAGES.slideSand
      },
      {
        name: "Natural Black",
        colorCode: "#222222",
        image: SHOE_IMAGES.slideNaturalBlack
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Designed specifically for women\u2019s feet with a sleek, flattering profile and a soft cushioned band that holds securely without pinching.",
    materials: [
      "Ergonomic contoured cushion footbed",
      "Soft-touch padded upper strap",
      "Non-slip grooved rubber base"
    ],
    features: [
      "Ultra-lightweight step feel",
      "Anti-slip bottom traction pattern",
      "Easy to wipe clean"
    ],
    idealFor: "Indoor Lounging & Casual Outings",
    buildQuality: "Plush EVA Comfort Construction",
    rating: 4.9,
    reviewCount: 420
  },
  // 6. Men's JUTU Slide - Natural Black 2
  {
    id: "262366",
    name: "MEN'S JUTU SLIDE",
    subtitle: "Textured strap with shock-absorbing contoured arch support.",
    category: "slides",
    gender: "men",
    price: 1650,
    badge: "New",
    colors: [
      {
        name: "Natural Black",
        colorCode: "#1a1a1a",
        image: SHOE_IMAGES.slideNaturalBlack
      },
      {
        name: "Anthracite",
        colorCode: "#464442",
        image: SHOE_IMAGES.slideAnthracite
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Lightweight slide crafted with durable cushioning for everyday relaxation, gym recovery, and weekend wear.",
    materials: [
      "High-density comfort EVA foam",
      "Reinforced durable upper strap",
      "Traction grip pattern outsole"
    ],
    features: [
      "Quick rinse & dry cleanable",
      "Anatomical arched footbed",
      "Durable long-lasting build"
    ],
    idealFor: "Gym Recovery, Pool & Weekend Comfort",
    buildQuality: "Water-Resistant High-Density Foam",
    rating: 4.7,
    reviewCount: 290
  },
  // 7. Women's JUTU Flip Flop - Sand
  {
    id: "262367",
    name: "WOMEN'S JUTU FLIP FLOP",
    subtitle: "Warm sand tone with cushioned arch support and soft woven toe strap.",
    category: "slides",
    gender: "women",
    price: 1350,
    badge: "New",
    colors: [
      {
        name: "Sand",
        colorCode: "#c2b4a1",
        image: SHOE_IMAGES.flipFlopSand
      },
      {
        name: "Natural Black",
        colorCode: "#1f1f1f",
        image: SHOE_IMAGES.flipFlopBlack
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Effortlessly comfortable flip flops designed for lightweight daily steps, beach walks, and home relaxation.",
    materials: [
      "Flexible contoured cushion sole",
      "Soft woven anti-friction toe strap",
      "Non-slip grip bottom sole"
    ],
    features: [
      "Zero chafing or blisters on toes",
      "Shock-absorbing footbed",
      "Water-friendly and quick-dry"
    ],
    idealFor: "Beach, Vacation & Everyday Home Wear",
    buildQuality: "Flexible High-Comfort Cushion",
    rating: 4.8,
    reviewCount: 310
  },
  // 8. Men's JUTU Flip Flop - Sand
  {
    id: "262368",
    name: "MEN'S JUTU FLIP FLOP",
    subtitle: "Earthy neutral flip flop built with durable high-traction sole.",
    category: "slides",
    gender: "men",
    price: 1350,
    badge: "New",
    colors: [
      {
        name: "Sand",
        colorCode: "#c2b4a1",
        image: SHOE_IMAGES.flipFlopSand
      },
      {
        name: "Natural Black",
        colorCode: "#1f1f1f",
        image: SHOE_IMAGES.flipFlopBlack
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Rugged yet soft flip flops built for daily post-run comfort, casual strolls, and humid weather ease.",
    materials: [
      "High-durability EVA comfort sole",
      "Reinforced woven toe post strap",
      "Textured anti-skid bottom treads"
    ],
    features: [
      "Quick-drying and water resistant",
      "Flexible and durable sole",
      "Gentle on skin during long walks"
    ],
    idealFor: "Casual Strolls, Home & Summer Wear",
    buildQuality: "Heavy-Duty Lightweight Construction",
    rating: 4.7,
    reviewCount: 220
  },
  // 9. Women's Canvas Cruiser Slip On - Warm White
  {
    id: "262369",
    name: "WOMEN'S CANVAS CRUISER SLIP ON",
    subtitle: "Classic retro canvas slip-on with modern comfort and elastic side stretch gore.",
    category: "cruisers",
    gender: "women",
    price: 2850,
    badge: "New",
    colors: [
      {
        name: "Warm White",
        colorCode: "#eae4d9",
        image: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite
      },
      {
        name: "Sea Spray",
        colorCode: "#7298ac",
        image: SHOE_IMAGES.canvasCruiserSeaSpray
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "A timeless low-profile slip-on sneaker crafted with heavy-duty breathable canvas, flexible side stretch gores, and non-slip rubber grip.",
    materials: [
      "Heavy-duty breathable cotton canvas upper",
      "High-cushion responsive foam insole",
      "Vulcanized anti-slip rubber outsole",
      "Dual elastic stretch side gores"
    ],
    features: [
      "Easy hands-free slip-on fit",
      "Elastic side gore expands with movement",
      "Removable cushioned insole"
    ],
    idealFor: "Daily Office, University & City Walking",
    buildQuality: "Reinforced Vulcanized Canvas Build",
    rating: 4.9,
    reviewCount: 650
  },
  // 10. Women's Cruiser Slip On - Blizzard
  {
    id: "262370",
    name: "WOMEN'S CRUISER SLIP ON",
    subtitle: "Streamlined textured knit slip-on in pure blizzard white.",
    category: "cruisers",
    gender: "women",
    price: 3250,
    badge: "New",
    colors: [
      {
        name: "Blizzard",
        colorCode: "#ffffff",
        image: SHOE_IMAGES.cruiserSlipOnBlizzard
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Pure blizzard white knit slip-on with cushioned arch support, padded heel collar, and lightweight step bounce.",
    materials: [
      "Breathable engineered diamond knit upper",
      "High-rebound shock-absorbing midsole",
      "Padded ankle collar prevents slipping",
      "Flexible non-slip rubber traction sole"
    ],
    features: [
      "Machine washable on gentle cycle",
      "Diamond textured knit breathes easily",
      "Zero break-in period comfort"
    ],
    idealFor: "All-Day Standing, Travel & Casual Wear",
    buildQuality: "Seamless Engineered Knit",
    rating: 4.8,
    reviewCount: 420
  },
  // 11. Women's Runner NZ Slip On - Mushroom
  {
    id: "262371",
    name: "WOMEN'S RUNNER NZ SLIP ON",
    subtitle: "Everyday slip-on crafted with flexible stretch knit and cloud comfort.",
    category: "runners",
    gender: "women",
    price: 3450,
    badge: "New",
    colors: [
      {
        name: "Mushroom",
        colorCode: "#beb3a3",
        image: SHOE_IMAGES.runnerSlipOnMushroom
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Designed for barefoot freedom with instant slip-on ease, ribbed knit wave upper, and supportive arch cushion for smooth strides.",
    materials: [
      "High-stretch breathable weave upper",
      "High-rebound shock absorbing midsole",
      "Non-marking traction rubber grip pods",
      "Integrated pull tab on heel"
    ],
    features: [
      "Sock-like flexible knit fit",
      "Machine washable design",
      "Anatomical heel lock & arch support"
    ],
    idealFor: "Daily Commutes, Walking & Workouts",
    buildQuality: "High-Density Breathable Weave",
    rating: 4.9,
    reviewCount: 1420
  },
  // 12. Women's Runner NZ Slip On - Anthracite
  {
    id: "262372",
    name: "WOMEN'S RUNNER NZ SLIP ON",
    subtitle: "Charcoal ribbed sock runner slip-on with cloud-like bouncy cushioning.",
    category: "runners",
    gender: "women",
    price: 3450,
    badge: "New",
    colors: [
      {
        name: "Anthracite",
        colorCode: "#403d39",
        image: SHOE_IMAGES.runnerSlipOnAnthracite
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Easy slip-on sock sneaker in anthracite charcoal with integrated heel pull tab and high-traction grooved outsole.",
    materials: [
      "Breathable multi-zone knit upper",
      "High-rebound shock absorbing midsole",
      "Reinforced heel and toe stability zones",
      "Padded anti-friction inner collar"
    ],
    features: [
      "Seamless glove-like sock fit",
      "Machine washable on cold cycle",
      "Enhanced torsional stability"
    ],
    idealFor: "Casual, Gym Training & Travel",
    buildQuality: "Multi-Zone Engineered Knit",
    rating: 4.9,
    reviewCount: 980
  },
  // 13. Women's Runner NZ Slip On - Dark Navy
  {
    id: "262373",
    name: "WOMEN'S RUNNER NZ SLIP ON",
    subtitle: "Deep dark navy ribbed sock runner slip-on with supportive step bounce.",
    category: "runners",
    gender: "women",
    price: 3450,
    badge: "New",
    colors: [
      {
        name: "Dark Navy",
        colorCode: "#1d2638",
        image: SHOE_IMAGES.runnerSlipOnDarkNavy
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Easy slip-on sock sneaker in dark navy with integrated heel pull tab and engineered wave knit for superior airflow.",
    materials: [
      "Breathable multi-zone wave knit upper",
      "High-rebound shock absorbing midsole",
      "Durable high-traction rubber outsole",
      "Soft moisture-wicking sock liner"
    ],
    features: [
      "Seamless sock fit with high flexibility",
      "Machine washable",
      "Torsional arch stability"
    ],
    idealFor: "Daily Walking, Commute & Exercise",
    buildQuality: "High-Elasticity Performance Knit",
    rating: 4.9,
    reviewCount: 840
  },
  {
    id: "262374",
    name: "MEN'S TREE DASHER 2",
    subtitle: "Responsive daily running and training shoe with high-grip traction.",
    category: "dashers",
    gender: "men",
    price: 4850,
    badge: "Best",
    colors: [
      {
        name: "Sage Green",
        colorCode: "#6d8073",
        image: SHOE_IMAGES.dasherSageGreen
      },
      {
        name: "Thunder Blue",
        colorCode: "#3c526b",
        image: SHOE_IMAGES.dasherSageGreen
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Engineered with active traction lugs and a responsive dual-density cushioning midsole for running, jogging, and gym sessions.",
    materials: [
      "Seamless one-piece breathable athletic mesh upper",
      "Dual-density responsive shock-absorbing midsole",
      "All-weather anti-skid rubber traction lugs",
      "Anatomical padded heel counter"
    ],
    features: [
      "Anatomical heel collar lock for zero slippage",
      "Reflective safety highlights for night visibility",
      "Enhanced torsional arch stability"
    ],
    idealFor: "Running, Marathon Training & Gym Workouts",
    buildQuality: "Athletic Performance Dual-Density Build",
    rating: 4.9,
    reviewCount: 3120
  },
  {
    id: "262375",
    name: "MEN'S RUNNER NZ SLIP ON",
    subtitle: "Clean everyday sneaker slip-on with cushioned arch support.",
    category: "runners",
    gender: "men",
    price: 3450,
    colors: [
      {
        name: "Anthracite",
        colorCode: "#383838",
        image: SHOE_IMAGES.runnerSlipOnAnthracite
      },
      {
        name: "Dark Navy",
        colorCode: "#1f293d",
        image: SHOE_IMAGES.runnerSlipOnDarkNavy
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Easy on, easy off. The Men\u2019s Runner NZ Slip On features a streamlined knit silhouette with cushioned walking support.",
    materials: [
      "Stretch-engineered breathable knit upper",
      "High-density cushioned walking sole",
      "Reinforced non-marking grip outsole",
      "Padded comfort collar"
    ],
    features: [
      "Instant hands-free slip-on entry",
      "Machine washable construction",
      "Lightweight multi-directional flexibility"
    ],
    idealFor: "Office Casual, Daily Walking & Travel",
    buildQuality: "Reinforced Breathable Sock-Knit",
    rating: 4.8,
    reviewCount: 1105
  },
  {
    id: "262376",
    name: "WOMEN'S TREE RUNNER",
    subtitle: "Our iconic breathable everyday sneaker with cloud-soft stride.",
    category: "runners",
    gender: "women",
    price: 3650,
    badge: "Best",
    colors: [
      {
        name: "Mist Blue",
        colorCode: "#7895a2",
        image: SHOE_IMAGES.treeRunnerMistBlue
      },
      {
        name: "Blush Pink",
        colorCode: "#cca4a4",
        image: SHOE_IMAGES.treeRunnerMistBlue
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "The sneaker designed for all-day comfort. Lightweight, wonderfully airy, and equipped with a shock-absorbing cushioned sole.",
    materials: [
      "Air-flow mesh breathable knit upper",
      "High-rebound shock absorption midsole",
      "Padded collar and anti-slip rubber traction pads",
      "Cushioned removable insole"
    ],
    features: [
      "Silky smooth and cool against skin",
      "Cushioned low-density walking sole",
      "Machine washable on cold cycle"
    ],
    idealFor: "Daily Walking, Travel & Casual Outings",
    buildQuality: "High-Flow Breathable Air Mesh",
    rating: 4.9,
    reviewCount: 8940
  },
  {
    id: "262377",
    name: "WOOL LOUNGER SLIP-ON",
    subtitle: "Cozy slip-on sneaker crafted with ultra-plush comfort lining.",
    category: "loungers",
    gender: "unisex",
    price: 3850,
    colors: [
      {
        name: "Dapple Grey",
        colorCode: "#787878",
        image: SHOE_IMAGES.woolLoungerDappleGrey
      },
      {
        name: "True Navy",
        colorCode: "#1a273b",
        image: SHOE_IMAGES.woolLoungerDappleGrey
      }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    description: "Soft, itch-free, and temperature-regulating. The Lounger provides instant step-in comfort for long hours at work or home.",
    materials: [
      "Premium soft textured comfort upper",
      "High-rebound cushioned shock-absorbing midsole",
      "Anti-slip flexible rubber outsole",
      "Plush padded interior lining"
    ],
    features: [
      "Naturally soft and odor-resistant lining",
      "Breathable all-season comfort",
      "Comfortable to wear with or without socks"
    ],
    idealFor: "Home, Office & Casual Outings",
    buildQuality: "Plush Textured Comfort Build",
    rating: 4.8,
    reviewCount: 4890
  },
  {
    id: "262378",
    name: "MEN'S TREE PIPER",
    subtitle: "Classic low-top lace sneaker with crisp clean profile.",
    category: "cruisers",
    gender: "men",
    price: 3450,
    badge: "New",
    colors: [
      {
        name: "Chalk White",
        colorCode: "#f3f0ea",
        image: SHOE_IMAGES.treePiperChalkWhite
      },
      {
        name: "Obsidian Black",
        colorCode: "#1a1a1a",
        image: SHOE_IMAGES.treePiperChalkWhite
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "A versatile low-top lace sneaker engineered with breathable upper weave and supportive low-profile cushioning.",
    materials: [
      "Engineered breathable knit weave",
      "Cushioned dual-density walking sole",
      "Non-slip grip rubber pads"
    ],
    features: [
      "Low profile classic sneaker design",
      "Cushioned footbed for day-long walking",
      "Machine washable"
    ],
    idealFor: "Daily Office, University & City Walking",
    buildQuality: "Reinforced Dual-Density Soling",
    rating: 4.8,
    reviewCount: 760
  },
  {
    id: "262379",
    name: "WOMEN'S WOOL RUNNER MIZZLE",
    subtitle: "Weather-resistant walking sneaker with water-repellent coating.",
    category: "runners",
    gender: "women",
    price: 3950,
    badge: "New",
    colors: [
      {
        name: "Storm Grey",
        colorCode: "#5a626a",
        image: SHOE_IMAGES.woolRunnerMizzleGrey
      },
      {
        name: "Natural White",
        colorCode: "#f5f5f0",
        image: SHOE_IMAGES.woolRunnerMizzleGrey
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Designed for drizzly wet days with water-shielding breathable finish and all-weather puddle traction.",
    materials: [
      "Water-repellent breathable treated upper",
      "Deep tread non-skid rubber outsole",
      "Plush padded interior"
    ],
    features: [
      "Water-shield barrier keeps feet dry",
      "Extra grip on slick pavements",
      "All-day thermal regulation"
    ],
    idealFor: "Rainy Days, Commuting & Outdoor Walking",
    buildQuality: "Weather-Shield High Grip Build",
    rating: 4.9,
    reviewCount: 1240
  },
  {
    id: "262380",
    name: "MEN'S TRAIL RUNNER SWT",
    subtitle: "Rugged off-road trail running shoe with deep lug traction.",
    category: "dashers",
    gender: "men",
    price: 4950,
    badge: "New",
    colors: [
      {
        name: "Forest Green",
        colorCode: "#3b4d3c",
        image: SHOE_IMAGES.trailRunnerSWTGreen
      },
      {
        name: "Charcoal Terra",
        colorCode: "#2e2e2e",
        image: SHOE_IMAGES.trailRunnerSWTGreen
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Built to conquer uneven dirt tracks and rugged trails with multi-directional 4mm rubber lugs and reinforced mudguards.",
    materials: [
      "Ripstop durable upper mesh with mudguard",
      "4mm high-traction rugged grip lugs",
      "High-impact shock absorbing foam"
    ],
    features: [
      "Mudguard protection against debris",
      "Heavy-duty grip on gravel and grass",
      "Stabilizing heel counter"
    ],
    idealFor: "Hiking, Trail Running & Outdoor Adventures",
    buildQuality: "Heavy-Duty All-Terrain Construction",
    rating: 4.9,
    reviewCount: 880
  },
  {
    id: "262381",
    name: "WOMEN'S TREE BREEZER FLAT",
    subtitle: "Silky smooth ballet flat engineered with bouncy arch cushion.",
    category: "cruisers",
    gender: "women",
    price: 2950,
    badge: "New",
    colors: [
      {
        name: "Jet Black",
        colorCode: "#1f1f1f",
        image: SHOE_IMAGES.treeBreezerJetBlack
      },
      {
        name: "Blush Sand",
        colorCode: "#d4bba7",
        image: SHOE_IMAGES.treeBreezerJetBlack
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "The elegant everyday flat you can walk miles in without discomfort. Features a flexible ribbed collar and supportive insole.",
    materials: [
      "Air-flow silky ribbed weave",
      "Flexible lightweight rubber sole",
      "Plush padded orthotic footbed"
    ],
    features: [
      "Elastic collar hugs your foot smoothly",
      "Packs flat for effortless travel",
      "Machine washable"
    ],
    idealFor: "Office, Travel & Dressy Casual",
    buildQuality: "Flexible Seamless Weave",
    rating: 4.8,
    reviewCount: 2310
  },
  {
    id: "262382",
    name: "MEN'S WOOL RUNNER GO",
    subtitle: "Featherlight cushioned walking shoe with minimalist silhouette.",
    category: "runners",
    gender: "men",
    price: 3550,
    badge: "New",
    colors: [
      {
        name: "Natural Grey",
        colorCode: "#737373",
        image: SHOE_IMAGES.woolLoungerDappleGrey
      },
      {
        name: "Deep Slate",
        colorCode: "#2f3b48",
        image: SHOE_IMAGES.woolLoungerDappleGrey
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Designed for effortless strides with low-profile flexible cushioning and smooth, temperature-balanced lining.",
    materials: [
      "Breathable soft-knit upper weave",
      "Ultra-lightweight EVA cushion midsole",
      "Reinforced heel strike zone"
    ],
    features: [
      "Zero pinch points or hotspots",
      "Flexible sole mimics natural foot movement",
      "Machine washable"
    ],
    idealFor: "All-Day Standing, Travel & Walking",
    buildQuality: "Lightweight Comfort Foam",
    rating: 4.8,
    reviewCount: 950
  },
  {
    id: "262383",
    name: "WOMEN'S TREE FLYER TRAINING",
    subtitle: "High-rebound workout sneaker with responsive bounce technology.",
    category: "dashers",
    gender: "women",
    price: 4650,
    badge: "New",
    colors: [
      {
        name: "Lavender Mist",
        colorCode: "#988ca3",
        image: SHOE_IMAGES.treeFlyerLavender
      },
      {
        name: "Cloud White",
        colorCode: "#f8f8f8",
        image: SHOE_IMAGES.treeFlyerLavender
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Engineered with high-rebound cushioning foam for energetic strides during cardio, HIIT, and fast-paced walking.",
    materials: [
      "High-ventilation breathable knit upper",
      "Responsive energy-return bounce midsole",
      "Zoned rubber traction pads"
    ],
    features: [
      "Springy energy return on every step",
      "Lateral stability support wings",
      "Ultra-breathable airflow mesh"
    ],
    idealFor: "Gym, HIIT, Cardio & Fast Walking",
    buildQuality: "Energy-Return Performance Foam",
    rating: 4.9,
    reviewCount: 1470
  },
  {
    id: "262384",
    name: "MEN'S TREE RUNNER BREEZE",
    subtitle: "Ultra-airy mesh sneaker for daily city walking and warm weather.",
    category: "runners",
    gender: "men",
    price: 3650,
    badge: "New",
    colors: [
      {
        name: "Salt White",
        colorCode: "#faf9f6",
        image: SHOE_IMAGES.treeRunnerBreezeWhite
      },
      {
        name: "Navy Cobalt",
        colorCode: "#203254",
        image: SHOE_IMAGES.treeRunnerBreezeWhite
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Lightweight and exceptionally breathable daily sneaker with flexible cushioned outsole.",
    materials: [
      "High-ventilation knitted mesh",
      "Cushioned shock-absorbing EVA",
      "Non-slip grip pads"
    ],
    features: [
      "Breathable all-day airflow",
      "Cushioned stride",
      "Machine washable"
    ],
    idealFor: "Daily Walking, Travel & Commutes",
    buildQuality: "Breathable Knit Soling",
    rating: 4.9,
    reviewCount: 1820
  },
  {
    id: "262385",
    name: "MEN'S CANVAS CRUISER SLIP ON",
    subtitle: "Effortless classic slip-on with dual stretch elastic side gores.",
    category: "cruisers",
    gender: "men",
    price: 2950,
    badge: "New",
    colors: [
      {
        name: "Washed Black",
        colorCode: "#292929",
        image: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite
      },
      {
        name: "Warm Olive",
        colorCode: "#4a5342",
        image: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "A timeless slip-on sneaker crafted with heavy-duty breathable cotton canvas and vulcanized anti-slip rubber outsole.",
    materials: [
      "Heavy-duty breathable canvas",
      "High-rebound comfort insole",
      "Vulcanized waffle sole"
    ],
    features: [
      "Elastic side gore for easy slip-on",
      "Anti-slip waffle rubber grip",
      "Durable double stitching"
    ],
    idealFor: "College, Office & Casual Wear",
    buildQuality: "Vulcanized Canvas Construction",
    rating: 4.8,
    reviewCount: 930
  },
  {
    id: "262386",
    name: "MEN'S TREE DASHER RELAY",
    subtitle: "Laceless performance running shoe with supportive lockdown fit.",
    category: "dashers",
    gender: "men",
    price: 4750,
    badge: "New",
    colors: [
      {
        name: "Graphite Night",
        colorCode: "#222222",
        image: SHOE_IMAGES.dasherSageGreen
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Slip on and sprint. Engineered with targeted compression knit for secure foot lockdown without laces.",
    materials: [
      "Targeted compression athletic knit",
      "Dual-density high-cushion midsole",
      "High-traction rubber traction pods"
    ],
    features: [
      "Laceless locked-in athletic fit",
      "High-rebound energy bounce",
      "Reflective heel safety accents"
    ],
    idealFor: "Running, 5K Training & Workout",
    buildQuality: "High-Tension Performance Weave",
    rating: 4.9,
    reviewCount: 1640
  },
  {
    id: "262387",
    name: "WOMEN'S WOOL PIPER WOVEN",
    subtitle: "Low-profile minimalist sneaker with ultra-soft plush insole.",
    category: "cruisers",
    gender: "women",
    price: 3350,
    badge: "New",
    colors: [
      {
        name: "Cream Oatmeal",
        colorCode: "#dfd8ce",
        image: SHOE_IMAGES.treePiperChalkWhite
      },
      {
        name: "Soft Rose",
        colorCode: "#d2a7a7",
        image: SHOE_IMAGES.treePiperChalkWhite
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Chic low-profile sneaker that matches any dress or denim, offering cloud-cushioned comfort for long days out.",
    materials: [
      "Soft textured knit upper",
      "Flexible rubber outsole with traction grip",
      "Cushioned removable insole"
    ],
    features: [
      "Streamlined minimalist shape",
      "Cushioned footbed",
      "Machine washable"
    ],
    idealFor: "Work, Travel & Weekend Brunch",
    buildQuality: "Premium Soft-Touch Construction",
    rating: 4.8,
    reviewCount: 1110
  },
  {
    id: "262388",
    name: "WOMEN'S TREE DASHER GLIDE",
    subtitle: "Responsive cushioned athletic trainer with arch stability.",
    category: "dashers",
    gender: "women",
    price: 4850,
    badge: "New",
    colors: [
      {
        name: "Mint Glaze",
        colorCode: "#a1c2b5",
        image: SHOE_IMAGES.dasherSageGreen
      }
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    description: "Engineered for smooth transitions with anatomical heel collar and responsive bouncy cushion soles.",
    materials: [
      "Breathable engineered athletic weave",
      "Dual-density shock absorbing midsole",
      "All-surface rubber outsole"
    ],
    features: [
      "Anatomical heel lock prevents chafing",
      "High-impact shock absorption",
      "Ultra-breathable airflow"
    ],
    idealFor: "Running, Gym & Power Walking",
    buildQuality: "High-Performance Athletic Build",
    rating: 4.9,
    reviewCount: 2050
  },
  {
    id: "262389",
    name: "MEN'S WOOL LOUNGER CHROME",
    subtitle: "Plush slip-on loafer sneaker with cushioned indoor-outdoor sole.",
    category: "loungers",
    gender: "men",
    price: 3850,
    badge: "New",
    colors: [
      {
        name: "Charcoal Chrome",
        colorCode: "#3a3a3a",
        image: SHOE_IMAGES.woolLoungerDappleGrey
      }
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    description: "Effortlessly luxurious slip-on loafer silhouette with deep cushion arch support and flexible rubber base.",
    materials: [
      "Plush textured soft upper",
      "Cushioned dual-density walking base",
      "Non-marking traction rubber outsole"
    ],
    features: [
      "Hands-free slip-on entry",
      "Soft itch-free inner lining",
      "All-day comfort with or without socks"
    ],
    idealFor: "Office Casual, Lounging & Weekend Travel",
    buildQuality: "Dual-Density Luxury Soling",
    rating: 4.9,
    reviewCount: 1390
  }
];

// src/data/adminStore.ts
var INITIAL_ORDERS = [
  {
    id: "ord_8941690",
    orderNumber: "#8941690",
    date: "2026-08-24",
    status: "pending",
    paymentStatus: "paid_advance",
    advanceAmount: 200,
    subtotal: 2400,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 2400,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: "MIDUL HASAN",
      lastName: "MAHADI",
      email: "midul.hasan@example.com",
      phone: "+8801900000000",
      address: "House 42, Road 11, Block D, Banani",
      apartment: "Flat 5A",
      city: "Dhaka",
      state: "Dhaka Division",
      zipCode: "1213",
      country: "Bangladesh"
    },
    shippingMethod: {
      id: "dhaka-standard",
      title: "Inside Dhaka City",
      price: 0,
      estimatedDays: "1-2 business days"
    },
    paymentMethod: {
      type: "bkash",
      accountNumber: "01900000000",
      transactionId: "TRX98214KJA9"
    },
    items: [
      {
        id: "runner-nz-slip-on-anthracite-42",
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 42,
        quantity: 1
      }
    ],
    notes: "Please call before delivery. Ring bell twice."
  },
  {
    id: "ord_8151478",
    orderNumber: "#8151478",
    date: "2026-08-20",
    status: "pending",
    paymentStatus: "paid_advance",
    advanceAmount: 200,
    subtotal: 2400,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 2400,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: "\u09A8\u09BE\u09B8\u09BF\u09AB",
      lastName: ".",
      email: "nasif.ctg@example.com",
      phone: "01885479477",
      address: "GEC Circle, Nasirabad Housing Society",
      apartment: "Building 7, 3rd Floor",
      city: "Chittagong",
      state: "Chittagong Division",
      zipCode: "4000",
      country: "Bangladesh"
    },
    shippingMethod: {
      id: "outside-dhaka",
      title: "Outside Dhaka (All Bangladesh)",
      price: 130,
      estimatedDays: "2-3 business days"
    },
    paymentMethod: {
      type: "nagad",
      accountNumber: "01885479477",
      transactionId: "NAG782190LK"
    },
    items: [
      {
        id: "canvas-cruiser-sea-spray-41",
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 41,
        quantity: 1
      }
    ],
    notes: "Advance \u09F3200 paid via Nagad."
  },
  {
    id: "ord_2478101",
    orderNumber: "#2478101",
    date: "2026-08-18",
    status: "pending",
    paymentStatus: "paid_advance",
    advanceAmount: 200,
    subtotal: 999,
    discount: 0,
    shipping: 80,
    tax: 0,
    total: 1079,
    carbonOffsetKg: 2.3,
    shippingAddress: {
      firstName: "MIDUL HASAN",
      lastName: "MAHADI",
      email: "midul.hasan@example.com",
      phone: "+8801900000000",
      address: "House 14, Road 7, Dhanmondi",
      apartment: "4th Floor",
      city: "Dhaka",
      state: "Dhaka Division",
      zipCode: "1205",
      country: "Bangladesh"
    },
    shippingMethod: {
      id: "dhaka-standard",
      title: "Inside Dhaka City",
      price: 80,
      estimatedDays: "1-2 business days"
    },
    paymentMethod: {
      type: "bkash",
      accountNumber: "01900000000",
      transactionId: "BK829104LA"
    },
    items: [
      {
        id: "jutu-slide-anthracite-43",
        product: PRODUCTS[1] || PRODUCTS[0],
        selectedColor: (PRODUCTS[1] || PRODUCTS[0]).colors[0],
        selectedSize: 43,
        quantity: 1
      }
    ],
    notes: "Send in discrete luxury packaging."
  },
  {
    id: "ord_9021455",
    orderNumber: "#9021455",
    date: "2026-08-28",
    status: "confirmed",
    paymentStatus: "paid_full",
    subtotal: 5700,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 5700,
    carbonOffsetKg: 9.2,
    shippingAddress: {
      firstName: "Tanvir",
      lastName: "Ahmed",
      email: "tanvir.ahmed@example.com",
      phone: "+880 1712-345678",
      address: "House 28, Road 4, Gulshan-1",
      apartment: "Apt 6B",
      city: "Dhaka",
      state: "Dhaka Division",
      zipCode: "1212",
      country: "Bangladesh"
    },
    shippingMethod: {
      id: "express-dhaka",
      title: "Same Day Express Delivery (Dhaka)",
      price: 0,
      estimatedDays: "Within 24 hours"
    },
    paymentMethod: {
      type: "bkash",
      accountNumber: "01712345678",
      transactionId: "BK9948210X"
    },
    items: [
      {
        id: "wool-runner-pro-charcoal-42",
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 42,
        quantity: 2
      }
    ],
    notes: "Deliver before 6 PM."
  },
  {
    id: "ord_7712390",
    orderNumber: "#7712390",
    date: "2026-08-27",
    status: "processing",
    paymentStatus: "paid_advance",
    advanceAmount: 200,
    subtotal: 3200,
    discount: 0,
    shipping: 130,
    tax: 0,
    total: 3330,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: "Farhana",
      lastName: "Rahman",
      email: "farhana.r@example.com",
      phone: "01911223344",
      address: "Subidbazar, VIP Road",
      apartment: "Green Villa, 2nd Floor",
      city: "Sylhet",
      state: "Sylhet Division",
      zipCode: "3100",
      country: "Bangladesh"
    },
    shippingMethod: {
      id: "outside-dhaka",
      title: "Outside Dhaka (All Bangladesh)",
      price: 130,
      estimatedDays: "2-3 business days"
    },
    paymentMethod: {
      type: "nagad",
      accountNumber: "01911223344",
      transactionId: "NG8301982Z"
    },
    items: [
      {
        id: "tree-dasher-luxe-mist-38",
        product: PRODUCTS[2] || PRODUCTS[0],
        selectedColor: (PRODUCTS[2] || PRODUCTS[0]).colors[0],
        selectedSize: 38,
        quantity: 1
      }
    ],
    notes: "Size 38 checked for fit."
  },
  {
    id: "ord_6401928",
    orderNumber: "#6401928",
    date: "2026-08-25",
    status: "shipped",
    paymentStatus: "paid_full",
    courier: "Steadfast Courier",
    trackingNumber: "STF-8849201",
    subtotal: 4800,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 4800,
    carbonOffsetKg: 9.2,
    shippingAddress: {
      firstName: "Sadia",
      lastName: "Islam",
      email: "sadia.islam@example.com",
      phone: "01678123456",
      address: "House 8, Road 2, Sector 3, Uttara",
      apartment: "Flat 3A",
      city: "Dhaka",
      state: "Dhaka Division",
      zipCode: "1230",
      country: "Bangladesh"
    },
    shippingMethod: {
      id: "dhaka-standard",
      title: "Inside Dhaka City",
      price: 0,
      estimatedDays: "1-2 business days"
    },
    paymentMethod: {
      type: "card",
      last4: "4242"
    },
    items: [
      {
        id: "runner-nz-sea-spray-39",
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 39,
        quantity: 1
      }
    ]
  },
  {
    id: "ord_5192834",
    orderNumber: "#5192834",
    date: "2026-08-22",
    status: "delivered",
    paymentStatus: "cod",
    courier: "Pathao Logistics",
    trackingNumber: "PTH-9021849",
    subtotal: 2850,
    discount: 0,
    shipping: 80,
    tax: 0,
    total: 2930,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: "Rafiqul",
      lastName: "Hassan",
      email: "rafiq.hassan@example.com",
      phone: "01819876543",
      address: "KDA Avenue, Sonadanga",
      city: "Khulna",
      state: "Khulna Division",
      zipCode: "9100",
      country: "Bangladesh"
    },
    shippingMethod: {
      id: "outside-dhaka",
      title: "Outside Dhaka (All Bangladesh)",
      price: 80,
      estimatedDays: "2-3 business days"
    },
    paymentMethod: {
      type: "cod"
    },
    items: [
      {
        id: "canvas-cruiser-anthracite-44",
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 44,
        quantity: 1
      }
    ]
  }
];
var INITIAL_PAYMENT_CONFIG = {
  bkash: {
    enabled: true,
    type: "merchant",
    accountNumber: "01900000000",
    instructions: 'Go to your bKash App or dial *247# -> Choose "Make Payment" -> Enter Merchant Number 01900000000 -> Enter Amount -> Enter Reference: Order ID -> Enter PIN to confirm.',
    requireAdvance: true,
    advanceAmount: 200
  },
  nagad: {
    enabled: true,
    type: "merchant",
    accountNumber: "01885479477",
    instructions: 'Go to Nagad App or dial *167# -> Choose "Merchant Pay" -> Enter 01885479477 -> Enter Amount -> Reference: Order ID -> Enter PIN.',
    requireAdvance: true,
    advanceAmount: 200
  },
  cod: {
    enabled: true,
    requireAdvance: false,
    advanceType: "fixed_amount",
    advanceAmount: 150,
    advanceRequiredAmount: 0,
    bkashNumber: "01900000000",
    nagadNumber: "01885479477",
    maxLimit: 15e3,
    instructions: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09A8\u09AB\u09BE\u09B0\u09CD\u09AE \u0995\u09B0\u09A4\u09C7 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0989\u09AA\u09B0\u09C7\u09B0 \u09AC\u09BF\u0995\u09BE\u09B6 \u09AC\u09BE \u09A8\u0997\u09A6 \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u099A\u09BE\u09B0\u09CD\u099C {amount} \u099F\u09BE\u0995\u09BE Send Money / Payment \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09A8\u09BF\u099A\u09C7\u09B0 \u0998\u09B0\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AB\u09CB\u09A8 \u09A8\u09AE\u09CD\u09AC\u09B0 \u0993 TrxID \u09A6\u09BF\u09A8\u0964 \u09AC\u09BE\u0995\u09BF \u099F\u09BE\u0995\u09BE \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09B0 \u09B8\u09AE\u09DF \u0995\u09CD\u09AF\u09BE\u09B6\u09C7 \u09AA\u09B0\u09BF\u09B6\u09CB\u09A7 \u0995\u09B0\u09AC\u09C7\u09A8\u0964",
    note: "Pay with cash upon delivery."
  },
  freeDelivery: {
    enabled: true,
    text: "Free delivery all over Bangladesh"
  }
};
var INITIAL_PAGES_CONTENT = {
  announcements: [
    "Fast 2-4 days nationwide express delivery across Bangladesh",
    "Free delivery all over Bangladesh \u2022 Easy Size Exchange",
    "Sustainable footwear crafted with premium natural wool & tree fiber"
  ],
  heroSlides: [
    {
      id: "dasher-nz",
      eyebrow: "ALL NEW COLLECTION",
      title: "Wildly Comfortable.\nBuilt For Everyday.",
      subtitle: "Engineered with merino wool and responsive sugarcane SweetFoam\xAE cushioning.",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=2200&q=88",
      primaryActionLabel: "SHOP MEN",
      primaryActionView: "men",
      secondaryActionLabel: "SHOP WOMEN",
      secondaryActionView: "women"
    },
    {
      id: "wool-runners",
      eyebrow: "SIGNATURE FOOTWEAR",
      title: "Modern Style,\nUnmatched Comfort.",
      subtitle: "Soft, breathable, temperature-regulating natural merino fibers.",
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=2200&q=88",
      primaryActionLabel: "SHOP MEN",
      primaryActionView: "men",
      secondaryActionLabel: "SHOP WOMEN",
      secondaryActionView: "women"
    },
    {
      id: "tree-flyer",
      eyebrow: "LIGHTWEIGHT PERFORMANCE",
      title: "Lighter On Feet.\nBuilt To Perform.",
      subtitle: "Breezy eucalyptus tree fiber upper with high-energy rebound sole.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2200&q=88",
      primaryActionLabel: "SHOP RUNNING",
      primaryActionView: "new-arrivals",
      secondaryActionLabel: "EXPLORE ALL",
      secondaryActionView: "men"
    },
    {
      id: "everyday-comfort",
      eyebrow: "PREMIUM COMFORT GUARANTEED",
      title: "The Most Comfortable\nShoes For Everyday.",
      subtitle: "Minimalist luxury aesthetic that effortlessly elevates your everyday looks.",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=2200&q=88",
      primaryActionLabel: "SHOP MEN",
      primaryActionView: "men",
      secondaryActionLabel: "SHOP WOMEN",
      secondaryActionView: "women"
    }
  ],
  categoryCards: [
    {
      id: "cat-new-arrivals",
      title: "NEW ARRIVALS",
      bgColor: "#5b7588",
      view: "new-arrivals",
      shoeImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
      alt: "New Arrivals Shoe"
    },
    {
      id: "cat-mens",
      title: "MENS",
      bgColor: "#5a5d5d",
      view: "men",
      shoeImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      alt: "Mens Collection Shoe"
    },
    {
      id: "cat-womens",
      title: "WOMENS",
      bgColor: "#8e6c71",
      view: "women",
      shoeImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      alt: "Womens Collection Shoe"
    },
    {
      id: "cat-best-sellers",
      title: "BEST SELLERS",
      bgColor: "#788a7c",
      view: "best-sellers",
      shoeImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
      alt: "Best Sellers Shoe"
    }
  ],
  bestSellers: {
    title: "BEST SELLERS",
    subtitle: "Crafted for Every Move"
  },
  lifestylePhotos: [
    {
      id: "photo-1",
      src: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
      alt: "JUTU Comfort Slides on concrete",
      view: "shop-all"
    },
    {
      id: "photo-2",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      alt: "Smiling woman wearing JUTU apparel in nature",
      view: "shop-all"
    },
    {
      id: "photo-3",
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      alt: "Casual lifestyle with JUTU slip-on shoes",
      view: "shop-all"
    },
    {
      id: "photo-4",
      src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      alt: "White socks and JUTU sneakers stepping outdoors",
      view: "shop-all"
    }
  ],
  valueProps: [
    {
      title: "WEAR ALL DAY COMFORT",
      description: "Lightweight, bouncy, and wildly comfortable, JUTU shoes make any outing feel effortless. Slip in, lace up, or slide them on and enjoy the comfy support."
    },
    {
      title: "DESIGNED FOR EVERYDAY WEAR",
      description: "Easy-to-wear styles made for daily routines, weekend plans, travel, and everything in between."
    },
    {
      title: "PREMIUM QUALITY & DURABILITY",
      description: "Engineered with high-grade breathable uppers, reinforced stitching, and anti-slip outsoles designed to last through every daily step and long walk."
    }
  ],
  whyUs: {
    badge: "THE CRAFT & COMFORT",
    title: "Why Choose Our Footwear",
    subtitle: "From renewable materials to ergonomic engineering, every pair is designed for all-day lightness and effortless elegance.",
    quote: "Wildly comfortable from the very first step.",
    showcaseImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
    bottomCtaTitle: "Ready to experience the comfort?",
    bottomCtaSubtitle: "Explore our lightweight shoes and new arrivals.",
    bottomCtaBtn: "Explore Collection",
    pillars: [
      {
        number: "01",
        title: "Anatomic Cushioning",
        badge: "ALL-DAY COMFORT",
        description: "Contoured arch support and shock-absorbing soles for cloud-like comfort.",
        spec: "38mm Ergonomic Drop",
        iconName: "Sparkles"
      },
      {
        number: "02",
        title: "Everyday Versatility",
        badge: "DAILY ESSENTIALS",
        description: "Easy slip-ons and lace-ups crafted for work, travel, and daily routines.",
        spec: "Micro-Knit Airflow Matrix",
        iconName: "Compass"
      },
      {
        number: "03",
        title: "Breathable & Durable",
        badge: "CRAFTSMANSHIP",
        description: "High-grade breathable uppers and non-slip outsoles engineered to last.",
        spec: "17.5 Micron ZQ Wool",
        iconName: "Layers"
      },
      {
        number: "04",
        title: "Nationwide Delivery",
        badge: "FAST SERVICE",
        description: "Cash on Delivery across Bangladesh within 24\u201372 hours with sizing support.",
        spec: "Reinforced Fiber Lock",
        iconName: "Truck"
      }
    ]
  },
  ourStory: {
    eyebrow: "OUR PHILOSOPHY & CRAFT",
    title: "Footwear Reimagined With Nature",
    lead: "We started JUTU with a simple question: why are modern shoes dominated by synthetic plastics and toxic petroleum when nature already offers superior materials?",
    heroImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1800&q=85",
    chapter1Image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
    founderQuote: "Nature is our greatest designer. By blending renewable wool, sugarcane, and tree fiber, we created the world\u2019s most comfortable walking footwear.",
    founderName: "Midul Hasan \u2014 Founder & Lead Designer",
    stat1Number: "100%",
    stat1Label: "Carbon Neutral Footprint",
    stat2Number: "0.0%",
    stat2Label: "Synthetic Microplastics Upper",
    stat3Number: "70+",
    stat3Label: "Comfort Testing Iterations"
  },
  shoeCare: {
    title: "How to Care for Your Footwear",
    subtitle: "Keep your shoes fresh, crisp, and comfortable for years with our easy care and washing instructions.",
    heroImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80",
    quickTips: [
      { title: "Remove Insoles & Laces", desc: "Pull out the insoles and unlace your shoes before washing to preserve the foam bounce." },
      { title: "Cold Water Gentle Cycle", desc: "Place shoes in a mesh delicates bag and wash on cold/wool setting with mild detergent." },
      { title: "Air Dry in Shade", desc: "Never put your shoes in a hot dryer. Allow them to air dry naturally away from direct heat." },
      { title: "Quick Spot Clean", desc: "For minor scuffs, use a damp cloth or soft bristle brush with warm water and soap." }
    ]
  },
  policies: {
    refundDays: 7,
    supportEmail: "care@jutufootwear.com",
    supportPhone: "+880 1900-000000",
    exchangeAddress: "JUTU Returns Hub, Level 4, House 12, Road 11, Banani, Dhaka-1213"
  }
};
var DEFAULT_CATEGORIES = [
  { id: "runners", name: "Runners", slug: "runners", badge: "BEST SELLER", active: true, sortOrder: 1, productCount: 8, description: "Everyday running, walking, and knit trainers" },
  { id: "cruisers", name: "Cruisers", slug: "cruisers", badge: "NEW", active: true, sortOrder: 2, productCount: 7, description: "Classic canvas sneakers and casual slip-ons" },
  { id: "slides", name: "Slides", slug: "slides", badge: "SUMMER HIT", active: true, sortOrder: 3, productCount: 7, description: "Comfort cushioned slides, flip-flops & recovery sandals" },
  { id: "dashers", name: "Dashers", slug: "dashers", badge: "PRO RUN", active: true, sortOrder: 4, productCount: 5, description: "High-performance athletic running and gym footwear" },
  { id: "loungers", name: "Loungers", slug: "loungers", badge: "SLIP-ON", active: true, sortOrder: 5, productCount: 2, description: "Plush slip-on loafers for everyday comfort" }
];
var DEFAULT_DELIVERY_OPTIONS = [
  {
    id: "dhaka-standard",
    title: "Inside Dhaka City",
    description: "Standard courier delivery across Dhaka",
    price: 80,
    estimatedDays: "1-2 business days",
    active: true,
    areaType: "dhaka"
  },
  {
    id: "outside-dhaka",
    title: "Outside Dhaka (All Bangladesh)",
    description: "Doorstep courier delivery across Bangladesh",
    price: 130,
    estimatedDays: "2-4 business days",
    active: true,
    areaType: "outside"
  },
  {
    id: "express-dhaka",
    title: "Same Day Express Delivery (Dhaka)",
    description: "Rush courier dispatch within 24 hours",
    price: 150,
    estimatedDays: "Same day (within 24 hours)",
    active: true,
    isExpress: true,
    areaType: "express"
  }
];
var INITIAL_STORE_SETTINGS = {
  storeName: "JUTU",
  brandTagline: "Sustainable Luxury Footwear Crafted with Natural Materials",
  supportPhone: "+880 1900-000000",
  whatsappNumber: "+880 1900-000000",
  supportEmail: "care@jutufootwear.com",
  showroomAddress: "Level 4, House 12, Road 11, Banani, Dhaka-1213",
  operatingHours: "Saturday \u2013 Thursday: 10:00 AM \u2013 8:00 PM",
  currencySymbol: "\u09F3",
  currencyCode: "BDT",
  // Header Logo & Branding (Matches UI configuration in screenshot)
  headerLogoUrl: "https://res.cloudinary.com/dcb45s5ib/image/upload/f_auto,q_auto,dpr_auto,fl_strip_profile,w_auto,c_limit/v1785177020/Untitled_design_2_o9mksx.png",
  logoType: "image",
  desktopLogoHeight: 54,
  mobileLogoHeight: 32,
  faviconUrl: "",
  // Categories Taxonomy
  categories: DEFAULT_CATEGORIES,
  // Security & Access Control
  adminEmail: "jutufashion@gmail.com",
  adminPassword: "jutu.fashion",
  adminPin: "1234",
  enablePinProtection: true,
  sessionTimeout: "1h",
  requirePinOnDelete: true,
  twoFactorAuth: false,
  ipWhitelistEnabled: false,
  allowedIps: "103.145.12.1, 103.205.71.18",
  // Telegram Notifications (🔔 Live Order Dispatch)
  telegramEnabled: true,
  telegramBotToken: "7482910482:AAHp9Q8L9dK1L_xR3M7q2V68e",
  telegramChatId: "-1001984729184",
  telegramNotifyNewOrder: true,
  telegramNotifyCancelledOrder: true,
  telegramNotifyLowStock: true,
  telegramNotifyContactMessage: true,
  telegramSilentNotification: false,
  // SMTP Email Configuration
  smtpEnabled: true,
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpEncryption: "TLS",
  smtpUsername: "orders@jutufootwear.com",
  smtpPassword: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
  smtpSenderName: "JUTU Footwear Bangladesh",
  smtpSenderEmail: "orders@jutufootwear.com",
  smtpReplyTo: "care@jutufootwear.com",
  smtpAdminAlertEmail: "scaleup.midul@gmail.com",
  smtpSendOrderConfirmation: true,
  // Shipping & Logistics Rates
  shippingDhaka: 80,
  shippingOutside: 130,
  shippingExpress: 150,
  freeShippingThreshold: 2e3,
  freeShippingEnabled: true,
  deliveryOptions: DEFAULT_DELIVERY_OPTIONS,
  // Marketing & Coupons
  coupons: [
    { id: "cpn-1", code: "JUTU10", discountType: "percentage", discountAmount: 10, minOrderAmount: 2e3, active: true, usageCount: 42 },
    { id: "cpn-2", code: "FIRSTPAIR", discountType: "fixed", discountAmount: 200, minOrderAmount: 2400, active: true, usageCount: 18 },
    { id: "cpn-3", code: "FREESHIP", discountType: "fixed", discountAmount: 130, minOrderAmount: 3e3, active: true, usageCount: 65 }
  ],
  promoBannerEnabled: true,
  promoBannerText: "Fast 2-4 days nationwide express delivery across Bangladesh \u2022 Free Shipping over \u09F32,000",
  urgencyStockThreshold: 3,
  // Tracking & Analytics Pixels
  metaPixelId: "102948172948201",
  metaCapiToken: "EAAG9Q...AQB582941094",
  metaDatasetId: "102948172948201",
  metaTestEventCode: "",
  gtmId: "GTM-JT7892K",
  ga4Id: "G-74892KLA89",
  ga4MeasurementId: "G-74892KLA89",
  ga4ApiSecret: "",
  tiktokPixelId: "C789201LAK92",
  domainVerificationMeta: "f4829k1ls829472kals",
  customHeadScript: "<!-- JUTU Core Head Injection Script -->",
  trackPageViewEnabled: true,
  trackPurchaseEnabled: true,
  trackAddToCartEnabled: true,
  // Footer & Social Channels
  footerBio: "Crafting the world's most comfortable, sustainable footwear from New Zealand merino wool, eucalyptus tree fiber, and sugarcane sweetfoam.",
  facebookUrl: "https://facebook.com/jutufootwear",
  instagramUrl: "https://instagram.com/jutufootwear",
  tiktokUrl: "https://tiktok.com/@jutufootwear",
  youtubeUrl: "https://youtube.com/@jutufootwear",
  linkedinUrl: "https://linkedin.com/company/jutu",
  copyrightText: "\xA9 2026 JUTU Inc. All Rights Reserved. Banani, Dhaka.",
  showPaymentBadges: true,
  // Floating WhatsApp Support
  enableWhatsAppFloating: true,
  whatsappFloatingNumber: "+880 1900-000000",
  whatsappDefaultMessage: "Hello JUTU Footwear, I would like to know more about your products.",
  whatsappButtonLabel: "Chat with us"
};
var INITIAL_MESSAGES = [
  {
    id: "msg_1",
    name: "Midul Hasan Mahadi",
    phone: "+8801900000000",
    email: "midul.hasan@example.com",
    subject: "Size exchange question for Wool Runner",
    message: "Hello, I ordered Size 42 but I normally wear 42.5 in Nike. Does this model run true to size or should I size up?",
    date: "2026-08-29 11:20 AM",
    status: "new"
  },
  {
    id: "msg_2",
    name: "Sarah Khan",
    phone: "01711223344",
    email: "sarah.k@example.com",
    subject: "Showroom Visit & Trying Shoes",
    message: "Hi team, is the Banani showroom open on Fridays? I want to visit with my family to try on the Canvas Cruisers.",
    date: "2026-08-28 04:15 PM",
    status: "in-progress",
    notes: "Informed Friday hours are 3:00 PM - 9:00 PM."
  },
  {
    id: "msg_3",
    name: "Kamrul Ahsan",
    phone: "01819876543",
    email: "kamrul.a@example.com",
    subject: "Corporate / Bulk Order Inquiry",
    message: "We are looking to gift 50 pairs of sustainable footwear for our executive leadership team. Can you provide custom branding or corporate discounts?",
    date: "2026-08-27 09:30 AM",
    status: "resolved",
    notes: "Sent executive catalog and 15% corporate tier proposal."
  }
];

// src/server/dbStore.ts
import fs from "fs";
import path from "path";
var REPO_DB_FILE_PATH = path.join(process.cwd(), "data", "store_database.json");
function getDbFilePath() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "store_database.json");
  }
  try {
    const dir = path.dirname(REPO_DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.accessSync(dir, fs.constants.W_OK);
    return REPO_DB_FILE_PATH;
  } catch {
    return path.join("/tmp", "store_database.json");
  }
}
var inMemoryDb = null;
function getInitialDatabase() {
  return {
    version: 1,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    products: PRODUCTS.map((p, idx) => ({
      ...p,
      id: p.id,
      productId: p.id,
      stock: p.stock ?? (idx === 0 ? 3 : 20),
      isOutOfStock: Boolean(p.isOutOfStock)
    })),
    orders: [...INITIAL_ORDERS],
    messages: [...INITIAL_MESSAGES],
    settings: {
      store: INITIAL_STORE_SETTINGS,
      payment: INITIAL_PAYMENT_CONFIG,
      pages_content: INITIAL_PAGES_CONTENT
    }
  };
}
function loadDatabase() {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  const writablePath = getDbFilePath();
  const candidates = [writablePath, REPO_DB_FILE_PATH];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          inMemoryDb = {
            version: parsed.version || 1,
            lastUpdated: parsed.lastUpdated || (/* @__PURE__ */ new Date()).toISOString(),
            products: parsed.products,
            orders: Array.isArray(parsed.orders) ? parsed.orders : [...INITIAL_ORDERS],
            messages: Array.isArray(parsed.messages) ? parsed.messages : [...INITIAL_MESSAGES],
            settings: {
              store: parsed.settings?.store || INITIAL_STORE_SETTINGS,
              payment: parsed.settings?.payment || INITIAL_PAYMENT_CONFIG,
              pages_content: parsed.settings?.pages_content || INITIAL_PAGES_CONTENT,
              ...parsed.settings || {}
            }
          };
          if (filePath !== writablePath) {
            saveDatabaseToDisk(inMemoryDb);
          }
          return inMemoryDb;
        }
      }
    } catch (err) {
      console.warn(`\u26A0\uFE0F [Local Persistent DB] Could not read ${filePath}:`, err.message);
    }
  }
  inMemoryDb = getInitialDatabase();
  saveDatabaseToDisk(inMemoryDb);
  return inMemoryDb;
}
function saveDatabaseToDisk(db) {
  const dataToSave = db || inMemoryDb;
  if (!dataToSave) return;
  dataToSave.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const targetFile = getDbFilePath();
    const dir = path.dirname(targetFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${targetFile}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), "utf-8");
    fs.renameSync(tempFile, targetFile);
  } catch (err) {
    console.warn("\u26A0\uFE0F [Local Persistent DB] Notice: Disk write skipped or failed (in-memory state preserved):", err.message);
  }
}
function dbGetProducts() {
  const db = loadDatabase();
  return db.products;
}
function dbSaveProduct(product) {
  const db = loadDatabase();
  const targetId = product.id || product.productId || `prod_${Date.now()}`;
  const record = {
    ...product,
    id: targetId,
    productId: targetId,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const idx = db.products.findIndex((p) => p.id === targetId || p.productId === targetId);
  if (idx >= 0) {
    db.products[idx] = { ...db.products[idx], ...record };
  } else {
    record.createdAt = record.createdAt || (/* @__PURE__ */ new Date()).toISOString();
    db.products.unshift(record);
  }
  saveDatabaseToDisk(db);
  return record;
}
function dbUpdateProductStock(id, stock) {
  const db = loadDatabase();
  const numStock = Math.max(0, Number(stock) || 0);
  const isOutOfStock = numStock <= 0;
  const idx = db.products.findIndex((p) => p.id === id || p.productId === id);
  if (idx >= 0) {
    db.products[idx].stock = numStock;
    db.products[idx].isOutOfStock = isOutOfStock;
    db.products[idx].updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    saveDatabaseToDisk(db);
    return db.products[idx];
  }
  return null;
}
function dbDeleteProduct(id) {
  const db = loadDatabase();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id && p.productId !== id);
  if (db.products.length !== initialLen) {
    saveDatabaseToDisk(db);
    return true;
  }
  return false;
}
function dbBulkSaveProducts(products) {
  const db = loadDatabase();
  db.products = [...products];
  saveDatabaseToDisk(db);
}
function dbGetOrders() {
  const db = loadDatabase();
  return db.orders;
}
function dbSaveOrder(orderData) {
  const db = loadDatabase();
  const orderNumber = orderData.orderNumber || orderData.id || `#${Date.now().toString().slice(-7)}`;
  const record = {
    ...orderData,
    orderNumber,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const idx = db.orders.findIndex((o) => o.orderNumber === orderNumber || o.id === orderNumber);
  if (idx >= 0) {
    db.orders[idx] = { ...db.orders[idx], ...record };
  } else {
    record.createdAt = record.createdAt || (/* @__PURE__ */ new Date()).toISOString();
    db.orders.unshift(record);
  }
  saveDatabaseToDisk(db);
  return record;
}
function dbUpdateOrder(orderNumber, updateData) {
  const db = loadDatabase();
  const cleanTarget = (orderNumber || "").replace(/^#/, "");
  const idx = db.orders.findIndex((o) => {
    const oNum = (o.orderNumber || "").replace(/^#/, "");
    const oId = (o.id || "").replace(/^#/, "");
    return o.orderNumber === orderNumber || o.id === orderNumber || oNum === cleanTarget || oId === cleanTarget;
  });
  if (idx >= 0) {
    db.orders[idx] = {
      ...db.orders[idx],
      ...updateData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveDatabaseToDisk(db);
    return db.orders[idx];
  }
  return null;
}
function dbDeleteOrder(orderNumber) {
  const db = loadDatabase();
  const initialLen = db.orders.length;
  const cleanTarget = (orderNumber || "").replace(/^#/, "");
  db.orders = db.orders.filter((o) => {
    const oNum = (o.orderNumber || "").replace(/^#/, "");
    const oId = (o.id || "").replace(/^#/, "");
    return o.orderNumber !== orderNumber && o.id !== orderNumber && oNum !== cleanTarget && oId !== cleanTarget;
  });
  if (db.orders.length !== initialLen) {
    saveDatabaseToDisk(db);
    return true;
  }
  return false;
}
function dbGetMessages() {
  const db = loadDatabase();
  return db.messages;
}
function dbSaveMessage(msgData) {
  const db = loadDatabase();
  const id = msgData.id || `msg_${Date.now()}`;
  const record = {
    ...msgData,
    id,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.messages.unshift(record);
  saveDatabaseToDisk(db);
  return record;
}
function dbUpdateMessage(id, updateData) {
  const db = loadDatabase();
  const idx = db.messages.findIndex((m) => m.id === id || m._id === id);
  if (idx >= 0) {
    db.messages[idx] = {
      ...db.messages[idx],
      ...updateData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveDatabaseToDisk(db);
    return db.messages[idx];
  }
  return null;
}
function dbDeleteMessage(id) {
  const db = loadDatabase();
  const initialLen = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== id && m._id !== id);
  if (db.messages.length !== initialLen) {
    saveDatabaseToDisk(db);
    return true;
  }
  return false;
}
function dbGetSetting(key) {
  const db = loadDatabase();
  return db.settings[key] || null;
}
function dbSaveSetting(key, value) {
  const db = loadDatabase();
  db.settings[key] = value;
  saveDatabaseToDisk(db);
  return value;
}

// src/server/app.ts
dotenv.config();
var app = express();
var router = express.Router();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
app.use((req, res, next) => {
  const xForwardedUri = req.headers["x-forwarded-uri"];
  const xVercelPath = req.headers["x-vercel-sc-path"];
  const xMatchedPath = req.headers["x-matched-path"];
  const matchedPath = xForwardedUri || xVercelPath || xMatchedPath;
  if (matchedPath && (req.url === "/api" || req.url === "/api/")) {
    req.url = matchedPath;
  }
  next();
});
function hashMetaField(val) {
  if (!val || typeof val !== "string") return void 0;
  const normalized = val.trim().toLowerCase();
  if (!normalized) return void 0;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
function normalizeAndHashPhone(phone) {
  if (!phone || typeof phone !== "string") return void 0;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return void 0;
  if (digits.startsWith("01")) {
    digits = "88" + digits;
  } else if (digits.startsWith("1") && digits.length === 10) {
    digits = "880" + digits;
  }
  return crypto.createHash("sha256").update(digits).digest("hex");
}
function cleanMongoPayload(data) {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) {
    return data.map((item) => cleanMongoPayload(item));
  }
  const clone = { ...data };
  delete clone._id;
  delete clone.__v;
  return clone;
}
var recentEvents = [];
var eventCounts = {
  PageView: 0,
  ViewContent: 0,
  AddToCart: 0,
  InitiateCheckout: 0,
  Purchase: 0,
  Contact: 0,
  Search: 0
};
async function ensureDatabaseSeeded() {
  loadDatabase();
  try {
    if (!isDbConnected()) return;
    const seedCheck = await StoreSettingsModel.findOne({ key: "has_seeded_initial_catalog_v3" });
    if (seedCheck) {
      return;
    }
    console.log("\u{1F331} [MongoDB Atlas] Initializing and seeding store data into MongoDB Atlas...");
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      const dbProducts = dbGetProducts();
      const seedItems = (dbProducts.length > 0 ? dbProducts : PRODUCTS).map((p, idx) => ({
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
        isCustomCreated: false
      }));
      await ProductModel.insertMany(seedItems);
      console.log(`\u2705 [MongoDB Atlas] Seeded ${seedItems.length} footwear products.`);
    }
    const orderCount = await OrderModel.countDocuments();
    const dbOrders = dbGetOrders();
    const ordersToSeed = dbOrders.length > 0 ? dbOrders : INITIAL_ORDERS;
    if (orderCount === 0 && ordersToSeed.length > 0) {
      for (const ord of ordersToSeed) {
        await OrderModel.findOneAndUpdate(
          { orderNumber: ord.orderNumber },
          { $set: ord },
          { upsert: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`\u2705 [MongoDB Atlas] Seeded ${ordersToSeed.length} initial orders.`);
    }
    const msgCount = await MessageModel.countDocuments();
    const dbMessages = dbGetMessages();
    const messagesToSeed = dbMessages.length > 0 ? dbMessages : INITIAL_MESSAGES;
    if (msgCount === 0 && messagesToSeed.length > 0) {
      for (const msg of messagesToSeed) {
        await MessageModel.findOneAndUpdate(
          { id: msg.id },
          { $set: msg },
          { upsert: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`\u2705 [MongoDB Atlas] Seeded ${messagesToSeed.length} customer messages.`);
    }
    const existingStoreSettings = await StoreSettingsModel.findOne({ key: "store" });
    if (!existingStoreSettings) {
      const storeVal = dbGetSetting("store") || INITIAL_STORE_SETTINGS;
      await StoreSettingsModel.create({ key: "store", value: storeVal });
    }
    const existingPaymentConfig = await StoreSettingsModel.findOne({ key: "payment" });
    if (!existingPaymentConfig) {
      const payVal = dbGetSetting("payment") || INITIAL_PAYMENT_CONFIG;
      await StoreSettingsModel.create({ key: "payment", value: payVal });
    }
    const existingPagesContent = await StoreSettingsModel.findOne({ key: "pages_content" });
    if (!existingPagesContent) {
      const pagesVal = dbGetSetting("pages_content") || INITIAL_PAGES_CONTENT;
      await StoreSettingsModel.create({ key: "pages_content", value: pagesVal });
    }
    await StoreSettingsModel.findOneAndUpdate(
      { key: "has_seeded_initial_catalog_v3" },
      { key: "has_seeded_initial_catalog_v3", value: { seededAt: (/* @__PURE__ */ new Date()).toISOString() } },
      { upsert: true }
    );
    console.log("\u{1F389} [MongoDB Atlas] Database seed completed successfully!");
  } catch (err) {
    console.error("\u26A0\uFE0F [MongoDB Atlas] Error during database seeding:", err.message);
  }
}
router.get("/health", async (req, res) => {
  const dbStatus = await connectToDatabase();
  await ensureDatabaseSeeded();
  const currentDb = loadDatabase();
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "JUTU E-Commerce API",
    persistentFileDb: {
      active: true,
      path: "data/store_database.json",
      productsCount: currentDb.products.length
    },
    mongodb: {
      connected: dbStatus.isConnected,
      driver: "MongoDB / Mongoose",
      error: dbStatus.error || null
    },
    environment: process.env.NODE_ENV || "development"
  });
});
router.get("/db-status", async (req, res) => {
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
        MessageModel.countDocuments()
      ]);
    } catch {
    }
  }
  res.json({
    ...diag,
    persistentFileDb: {
      active: true,
      path: "data/store_database.json",
      lastUpdated: currentDb.lastUpdated,
      productsCount: currentDb.products.length,
      ordersCount: currentDb.orders.length,
      messagesCount: currentDb.messages.length
    },
    stats: {
      productsCount,
      ordersCount,
      messagesCount
    }
  });
});
var handleDbTest = async (req, res) => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const currentDb = loadDatabase();
    await connectToDatabase();
    const diag = getDbConnectionDiagnostics();
    if (isDbConnected()) {
      return res.json({
        success: true,
        message: "MongoDB Atlas is successfully connected and responding.",
        diagnostics: diag,
        persistentFileDb: {
          active: true,
          productsCount: currentDb.products.length,
          ordersCount: currentDb.orders.length,
          messagesCount: currentDb.messages.length
        }
      });
    }
    if (!mongoUri) {
      return res.json({
        success: true,
        fallbackActive: true,
        message: "No MONGODB_URI provided. Active storage is using the reliable Server Persistent File Database (data/store_database.json).",
        diagnostics: diag,
        persistentFileDb: {
          active: true,
          productsCount: currentDb.products.length,
          ordersCount: currentDb.orders.length,
          messagesCount: currentDb.messages.length
        }
      });
    }
    return res.status(500).json({
      success: false,
      message: `Failed to connect to MongoDB: ${diag.lastError || "Unknown connection error"}`,
      diagnostics: diag
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database test encountered an unexpected exception",
      error: err.message
    });
  }
};
router.post("/db-test", handleDbTest);
router.get("/db-test", handleDbTest);
router.post("/store/push-all-local", async (req, res) => {
  try {
    const { products, orders, messages, settings, paymentConfig, pagesContent } = req.body;
    await connectToDatabase();
    const isConnected = isDbConnected();
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
    if (settings && typeof settings === "object") {
      db.settings.store = settings;
    }
    if (paymentConfig && typeof paymentConfig === "object") {
      db.settings.payment = paymentConfig;
    }
    if (pagesContent && typeof pagesContent === "object") {
      db.settings.pages_content = pagesContent;
    }
    saveDatabaseToDisk(db);
    const syncedProducts = products?.length || 0;
    const syncedOrders = orders?.length || 0;
    const syncedMessages = messages?.length || 0;
    if (isConnected) {
      if (Array.isArray(products) && products.length > 0) {
        for (const prod of products) {
          const prodId = prod.id || prod.productId;
          if (prodId) {
            const cleanProd = cleanMongoPayload({ ...prod, id: prodId, productId: prodId });
            await ProductModel.findOneAndUpdate(
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
            await OrderModel.findOneAndUpdate(
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
            await MessageModel.findOneAndUpdate(
              { $or: [{ id: msgId }, { _id: msgId }] },
              { $set: cleanMsg },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
          }
        }
      }
      if (settings && typeof settings === "object") {
        await StoreSettingsModel.findOneAndUpdate(
          { key: "store" },
          { $set: { key: "store", value: settings } },
          { upsert: true, new: true }
        );
      }
      if (paymentConfig && typeof paymentConfig === "object") {
        await StoreSettingsModel.findOneAndUpdate(
          { key: "payment" },
          { $set: { key: "payment", value: paymentConfig } },
          { upsert: true, new: true }
        );
      }
      if (pagesContent && typeof pagesContent === "object") {
        await StoreSettingsModel.findOneAndUpdate(
          { key: "pages_content" },
          { $set: { key: "pages_content", value: pagesContent } },
          { upsert: true, new: true }
        );
      }
      console.log(`\u2601\uFE0F [Database Sync] Complete: ${syncedProducts} products, ${syncedOrders} orders, ${syncedMessages} messages pushed to Database.`);
      return res.json({
        success: true,
        source: "mongodb_and_persistent_file",
        isDbConnected: true,
        syncedCounts: { products: syncedProducts, orders: syncedOrders, messages: syncedMessages },
        message: "Successfully saved and synchronized all store records to Database!"
      });
    }
    return res.json({
      success: true,
      source: "persistent_file_database",
      isDbConnected: false,
      syncedCounts: { products: syncedProducts, orders: syncedOrders, messages: syncedMessages },
      message: "Saved permanently to server database file (data/store_database.json)"
    });
  } catch (err) {
    console.error("\u274C [Database Push Error]", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/store/all", async (req, res) => {
  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();
    const db = loadDatabase();
    if (isDbConnected()) {
      const [products, orders, messages, settingsDoc, paymentDoc, pagesDoc] = await Promise.all([
        ProductModel.find().sort({ createdAt: -1 }),
        OrderModel.find().sort({ createdAt: -1 }).limit(150),
        MessageModel.find().sort({ createdAt: -1 }).limit(100),
        StoreSettingsModel.findOne({ key: "store" }),
        StoreSettingsModel.findOne({ key: "payment" }),
        StoreSettingsModel.findOne({ key: "pages_content" })
      ]);
      const formattedProducts = products.map((doc) => {
        const p = doc.toObject ? doc.toObject() : doc;
        return {
          ...p,
          id: p.id || p.productId || doc._id.toString()
        };
      });
      return res.json({
        success: true,
        source: "mongodb",
        isDbConnected: true,
        data: {
          products: formattedProducts.length > 0 ? formattedProducts : db.products,
          orders: orders || db.orders,
          messages: messages || db.messages,
          settings: settingsDoc ? settingsDoc.value : db.settings.store,
          paymentConfig: paymentDoc ? paymentDoc.value : db.settings.payment,
          pagesContent: pagesDoc ? pagesDoc.value : db.settings.pages_content
        }
      });
    }
    return res.json({
      success: true,
      source: "persistent_file_database",
      isDbConnected: false,
      data: {
        products: db.products,
        orders: db.orders,
        messages: db.messages,
        settings: db.settings.store,
        paymentConfig: db.settings.payment,
        pagesContent: db.settings.pages_content
      }
    });
  } catch (err) {
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
        pagesContent: db.settings.pages_content
      }
    });
  }
});
router.get("/orders", async (req, res) => {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(100);
      return res.json({ success: true, source: "mongodb", data: orders });
    }
    return res.json({ success: true, source: "persistent_file_database", data: dbGetOrders() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, fallback: dbGetOrders() });
  }
});
var handleCreateOrder = async (req, res) => {
  try {
    const orderData = req.body || {};
    const orderNumber = orderData.orderNumber || orderData.id || `#${Date.now().toString().slice(-7)}`;
    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const shippingAddress = orderData.shippingAddress || {
      firstName: orderData.customer?.name || orderData.customerName || "Customer",
      phone: orderData.customer?.phone || orderData.phone || "",
      address: orderData.customer?.address || orderData.address || "",
      city: orderData.customer?.city || orderData.city || "Dhaka"
    };
    const payload = {
      ...orderData,
      orderNumber,
      id: orderData.id || orderNumber,
      items,
      shippingAddress,
      total: Number(orderData.total) || 0,
      status: orderData.status || "pending",
      paymentStatus: orderData.paymentStatus || "cod",
      createdAt: orderData.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    let savedLocal = null;
    try {
      savedLocal = dbSaveOrder(payload);
    } catch (localErr) {
      console.warn("\u26A0\uFE0F [Local Order Save Warning]", localErr.message);
    }
    await connectToDatabase();
    if (isDbConnected()) {
      const cleanNum = orderNumber.replace(/^#/, "");
      const mongoPayload = cleanMongoPayload(payload);
      const created = await OrderModel.findOneAndUpdate(
        {
          $or: [
            { orderNumber },
            { id: orderNumber },
            { orderNumber: cleanNum },
            { orderNumber: `#${cleanNum}` }
          ]
        },
        { $set: mongoPayload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(201).json({ success: true, source: "mongodb_and_persistent_file", data: created });
    }
    return res.status(201).json({ success: true, source: "persistent_file_database", data: savedLocal || payload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
router.post("/orders", handleCreateOrder);
var handleUpdateOrder = async (req, res) => {
  try {
    const orderNumber = req.params.orderNumber || req.query.orderNumber || req.body?.orderNumber || req.body?.id;
    if (!orderNumber) {
      return res.status(400).json({ success: false, error: "Order number is required for update" });
    }
    const updateData = req.body || {};
    let updatedLocal = null;
    try {
      updatedLocal = dbUpdateOrder(orderNumber, updateData);
    } catch (localErr) {
      console.warn("\u26A0\uFE0F [Local Order Update Warning]", localErr.message);
    }
    await connectToDatabase();
    if (isDbConnected()) {
      const cleanNum = orderNumber.replace(/^#/, "");
      const isOid = mongoose3.isValidObjectId(orderNumber);
      const mongoUpdate = cleanMongoPayload({ ...updateData, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
      const updated = await OrderModel.findOneAndUpdate(
        {
          $or: [
            { orderNumber },
            { id: orderNumber },
            { orderNumber: cleanNum },
            { orderNumber: `#${cleanNum}` },
            ...isOid ? [{ _id: orderNumber }] : []
          ]
        },
        { $set: mongoUpdate },
        { new: true }
      );
      return res.json({ success: true, source: "mongodb_and_persistent_file", data: updated || updatedLocal });
    }
    if (updatedLocal) {
      return res.json({ success: true, source: "persistent_file_database", data: updatedLocal });
    }
    return res.status(404).json({ success: false, error: "Order not found" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
router.put("/orders/:orderNumber", handleUpdateOrder);
router.put("/orders", handleUpdateOrder);
router.post("/orders/:orderNumber", handleUpdateOrder);
var handleDeleteOrder = async (req, res) => {
  try {
    const orderNumber = req.params.orderNumber || req.query.orderNumber || req.query.id || req.body?.orderNumber || req.body?.id;
    if (!orderNumber) {
      return res.status(400).json({ success: false, error: "Order number or ID is required for deletion" });
    }
    dbDeleteOrder(orderNumber);
    await connectToDatabase();
    if (isDbConnected()) {
      const isOid = mongoose3.isValidObjectId(orderNumber);
      await OrderModel.deleteMany({
        $or: [
          { orderNumber },
          { id: orderNumber },
          ...isOid ? [{ _id: orderNumber }] : []
        ]
      });
    }
    return res.json({ success: true, message: `Order ${orderNumber} deleted successfully from 100% of database` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
router.delete("/orders/:orderNumber", handleDeleteOrder);
router.delete("/orders", handleDeleteOrder);
router.get("/products", async (req, res) => {
  try {
    await connectToDatabase();
    await ensureDatabaseSeeded();
    if (isDbConnected()) {
      const products = await ProductModel.find().sort({ createdAt: -1 });
      const formatted = products.map((doc) => {
        const p = doc.toObject ? doc.toObject() : doc;
        return {
          ...p,
          id: p.id || p.productId || doc._id.toString()
        };
      });
      return res.json({ success: true, source: "mongodb", data: formatted.length > 0 ? formatted : dbGetProducts() });
    }
    return res.json({ success: true, source: "persistent_file_database", data: dbGetProducts() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, fallback: dbGetProducts() });
  }
});
var handleSaveProduct = async (req, res) => {
  try {
    const productData = req.body || {};
    const urlId = req.params.id || req.query.id;
    const targetId = urlId || productData.id || productData.productId || `prod_${Date.now()}`;
    const payload = {
      ...productData,
      id: targetId,
      productId: targetId
    };
    let savedLocal = null;
    try {
      savedLocal = dbSaveProduct(payload);
    } catch (localErr) {
      console.warn("\u26A0\uFE0F [Local Product Save Warning] Proceeding with in-memory/MongoDB sync:", localErr.message);
    }
    try {
      await connectToDatabase();
      if (isDbConnected()) {
        const isOid = mongoose3.isValidObjectId(targetId);
        const mongoPayload = cleanMongoPayload(payload);
        const saved = await ProductModel.findOneAndUpdate(
          {
            $or: [
              { id: targetId },
              { productId: targetId },
              ...isOid ? [{ _id: targetId }] : []
            ]
          },
          { $set: mongoPayload },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
        );
        return res.status(200).json({ success: true, source: "mongodb_and_persistent_file", data: saved });
      }
    } catch (mongoErr) {
      console.warn("\u26A0\uFE0F [MongoDB Product Save Warning] Successfully saved to local persistent store, MongoDB notice:", mongoErr.message);
    }
    return res.status(200).json({ success: true, source: "persistent_file_database", data: savedLocal || payload });
  } catch (err) {
    console.error("\u274C [Product Save Error]", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to save product to database" });
  }
};
router.post("/products", handleSaveProduct);
router.post("/products/:id", handleSaveProduct);
router.put("/products", handleSaveProduct);
router.put("/products/:id", handleSaveProduct);
var handleUpdateStock = async (req, res) => {
  try {
    const id = req.params.id || req.query.id || req.body?.id;
    const { stock } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "Product id is required" });
    }
    const numStock = Math.max(0, Number(stock) || 0);
    const updatedLocal = dbUpdateProductStock(id, numStock);
    try {
      await connectToDatabase();
      if (isDbConnected()) {
        const isOid = mongoose3.isValidObjectId(id);
        const updated = await ProductModel.findOneAndUpdate(
          {
            $or: [
              { id },
              { productId: id },
              ...isOid ? [{ _id: id }] : []
            ]
          },
          { $set: { stock: numStock, isOutOfStock: numStock <= 0, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
          { returnDocument: "after" }
        );
        return res.json({ success: true, source: "mongodb_and_persistent_file", data: updated || updatedLocal });
      }
    } catch (mErr) {
      console.warn("\u26A0\uFE0F [MongoDB Stock Update Warning]:", mErr.message);
    }
    if (updatedLocal) {
      return res.json({ success: true, source: "persistent_file_database", data: updatedLocal });
    }
    return res.json({ success: true, source: "memory_fallback", data: { id, stock: numStock, isOutOfStock: numStock <= 0 } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
router.put("/products/stock/:id", handleUpdateStock);
router.put("/products/stock", handleUpdateStock);
router.post("/products/stock/:id", handleUpdateStock);
router.post("/products/stock", handleUpdateStock);
router.patch("/products/stock/:id", handleUpdateStock);
router.patch("/products/stock", handleUpdateStock);
router.put("/products/:id/stock", handleUpdateStock);
router.post("/products/:id/stock", handleUpdateStock);
router.patch("/products/:id/stock", handleUpdateStock);
var handleDeleteProduct = async (req, res) => {
  try {
    const id = req.params.id || req.query.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "Product id is required for deletion" });
    }
    dbDeleteProduct(id);
    await connectToDatabase();
    if (isDbConnected()) {
      const isOid = mongoose3.isValidObjectId(id);
      const deleteResult = await ProductModel.deleteMany({
        $or: [
          { id },
          { productId: id },
          ...isOid ? [{ _id: id }] : []
        ]
      });
      console.log(`[Database] Deleted product ${id} from MongoDB. Deleted count:`, deleteResult.deletedCount);
    }
    return res.json({ success: true, message: `Product ${id} deleted successfully from 100% of database` });
  } catch (err) {
    console.error("[Database Error] Failed to delete product:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
router.delete("/products/:id", handleDeleteProduct);
router.delete("/products", handleDeleteProduct);
router.post("/products/bulk", async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "products must be an array" });
    }
    dbBulkSaveProducts(products);
    try {
      await connectToDatabase();
      if (isDbConnected()) {
        for (const prod of products) {
          const prodId = prod.id || prod.productId;
          if (prodId) {
            const cleanProd = cleanMongoPayload({ ...prod, id: prodId, productId: prodId });
            await ProductModel.findOneAndUpdate(
              { $or: [{ id: prodId }, { productId: prodId }] },
              { $set: cleanProd },
              { upsert: true, returnDocument: "after" }
            );
          }
        }
        return res.json({ success: true, source: "mongodb_and_persistent_file", count: products.length });
      }
    } catch (mErr) {
      console.warn("\u26A0\uFE0F [MongoDB Bulk Products Warning]:", mErr.message);
    }
    return res.json({ success: true, source: "persistent_file_database", count: products.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.get("/messages", async (req, res) => {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const messages = await MessageModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: "mongodb", data: messages });
    }
    return res.json({ success: true, source: "persistent_file_database", data: dbGetMessages() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.post("/messages", async (req, res) => {
  try {
    const msgData = req.body;
    let savedLocal = null;
    try {
      savedLocal = dbSaveMessage(msgData);
    } catch (localErr) {
      console.warn("\u26A0\uFE0F [Local Message Save Warning]", localErr.message);
    }
    await connectToDatabase();
    if (isDbConnected()) {
      const cleanMsg = cleanMongoPayload(msgData);
      const created = await MessageModel.create(cleanMsg);
      return res.status(201).json({ success: true, source: "mongodb_and_persistent_file", data: created });
    }
    return res.status(201).json({ success: true, source: "persistent_file_database", data: savedLocal || msgData });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.put("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    let updatedLocal = null;
    try {
      updatedLocal = dbUpdateMessage(id, updateData);
    } catch (localErr) {
      console.warn("\u26A0\uFE0F [Local Message Update Warning]", localErr.message);
    }
    await connectToDatabase();
    if (isDbConnected()) {
      const cleanUpdate = cleanMongoPayload(updateData);
      const updated = await MessageModel.findOneAndUpdate(
        { $or: [{ _id: id }, { id }] },
        { $set: cleanUpdate },
        { new: true }
      );
      return res.json({ success: true, source: "mongodb_and_persistent_file", data: updated || updatedLocal });
    }
    if (updatedLocal) {
      return res.json({ success: true, source: "persistent_file_database", data: updatedLocal });
    }
    return res.status(404).json({ error: "Message not found" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var handleDeleteMessage = async (req, res) => {
  try {
    const id = req.params.id || req.query.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "Message ID is required for deletion" });
    }
    dbDeleteMessage(id);
    await connectToDatabase();
    if (isDbConnected()) {
      const isOid = mongoose3.isValidObjectId(id);
      await MessageModel.deleteMany({
        $or: [
          ...isOid ? [{ _id: id }] : [],
          { id }
        ]
      });
    }
    return res.json({ success: true, message: `Message ${id} deleted successfully from 100% of database` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
router.delete("/messages/:id", handleDeleteMessage);
router.delete("/messages", handleDeleteMessage);
router.get("/settings", async (req, res) => {
  try {
    await connectToDatabase();
    if (isDbConnected()) {
      const [storeDoc, paymentDoc, pagesDoc] = await Promise.all([
        StoreSettingsModel.findOne({ key: "store" }),
        StoreSettingsModel.findOne({ key: "payment" }),
        StoreSettingsModel.findOne({ key: "pages_content" })
      ]);
      return res.json({
        success: true,
        source: "mongodb",
        data: {
          store: storeDoc ? storeDoc.value : dbGetSetting("store"),
          payment: paymentDoc ? paymentDoc.value : dbGetSetting("payment"),
          pages_content: pagesDoc ? pagesDoc.value : dbGetSetting("pages_content")
        }
      });
    }
    return res.json({
      success: true,
      source: "persistent_file_database",
      data: {
        store: dbGetSetting("store"),
        payment: dbGetSetting("payment"),
        pages_content: dbGetSetting("pages_content")
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    await connectToDatabase();
    if (isDbConnected()) {
      const setting = await StoreSettingsModel.findOne({ key });
      return res.json({ success: true, source: "mongodb", data: setting ? setting.value : dbGetSetting(key) });
    }
    return res.json({ success: true, source: "persistent_file_database", data: dbGetSetting(key) || null });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.post("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    dbSaveSetting(key, value);
    await connectToDatabase();
    if (isDbConnected()) {
      const setting = await StoreSettingsModel.findOneAndUpdate(
        { key },
        { $set: { key, value } },
        { upsert: true, new: true }
      );
      return res.json({ success: true, source: "mongodb_and_persistent_file", data: setting ? setting.value : value });
    }
    return res.json({ success: true, source: "persistent_file_database", data: value });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.post("/tracking/meta-event", async (req, res) => {
  try {
    const {
      event_name,
      event_id,
      event_time,
      event_source_url,
      user_data = {},
      custom_data = {},
      action_source = "website"
    } = req.body;
    if (!event_name) {
      return res.status(400).json({ error: "event_name is required" });
    }
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
    const clientUserAgent = req.headers["user-agent"] || "";
    const hashedUserData = {
      client_ip_address: user_data.client_ip_address || clientIp,
      client_user_agent: user_data.client_user_agent || clientUserAgent
    };
    const customerFullName = (user_data.first_name || user_data.full_name || "").trim();
    if (customerFullName) {
      hashedUserData.fn = [hashMetaField(customerFullName)];
    }
    if (user_data.phone) {
      hashedUserData.ph = [normalizeAndHashPhone(user_data.phone)];
    }
    if (user_data.email) {
      hashedUserData.em = [hashMetaField(user_data.email)];
    }
    if (user_data.city) {
      hashedUserData.ct = [hashMetaField(user_data.city)];
    }
    if (user_data.state || user_data.division) {
      hashedUserData.st = [hashMetaField(user_data.state || user_data.division)];
    }
    if (user_data.country) {
      const countryStr = String(user_data.country).trim().toLowerCase();
      hashedUserData.country = [hashMetaField(countryStr === "bangladesh" || countryStr === "bd" ? "bd" : countryStr)];
    }
    if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
    if (user_data.external_id) {
      const extIds = Array.isArray(user_data.external_id) ? user_data.external_id : [user_data.external_id];
      hashedUserData.external_id = extIds.map((id) => hashMetaField(id)).filter(Boolean);
    }
    const payloadEventId = event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const unixTimestamp = event_time || Math.floor(Date.now() / 1e3);
    const metaPayload = {
      event_name,
      event_time: unixTimestamp,
      event_id: payloadEventId,
      event_source_url: event_source_url || req.headers.referer || "https://jutu.com",
      action_source,
      user_data: hashedUserData,
      custom_data
    };
    const datasetId = process.env.META_DATASET_ID || process.env.META_PIXEL_ID || req.body.dataset_id || req.body.meta_pixel_id;
    const accessToken = process.env.META_ACCESS_TOKEN || process.env.META_CAPI_TOKEN || req.body.access_token || req.body.meta_capi_token;
    const testEventCode = process.env.META_TEST_EVENT_CODE || req.body.test_event_code || req.body.meta_test_event_code;
    const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID || process.env.GA4_ID || req.body.ga4_measurement_id || req.body.ga4_id;
    const ga4ApiSecret = process.env.GA4_API_SECRET || req.body.ga4_api_secret;
    let dispatchStatus = "simulated_sandbox";
    let metaApiResponse = null;
    let ga4ApiResponse = null;
    if (datasetId && accessToken) {
      try {
        const metaApiUrl = `https://graph.facebook.com/v19.0/${datasetId}/events?access_token=${accessToken}`;
        const requestBody = {
          data: [metaPayload]
        };
        if (testEventCode) {
          requestBody.test_event_code = testEventCode;
        }
        const response = await fetch(metaApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });
        metaApiResponse = await response.json();
        if (response.ok) {
          dispatchStatus = "sent_to_meta";
        } else {
          dispatchStatus = "error";
          console.warn("[Meta CAPI Error]", metaApiResponse);
        }
      } catch (apiErr) {
        dispatchStatus = "error";
        metaApiResponse = { error: apiErr.message };
        console.error("[Meta CAPI Network Error]", apiErr);
      }
    }
    if (ga4MeasurementId && ga4ApiSecret) {
      try {
        const ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4ApiSecret}`;
        let ga4EventName = "page_view";
        if (event_name === "ViewContent") ga4EventName = "view_item";
        else if (event_name === "AddToCart") ga4EventName = "add_to_cart";
        else if (event_name === "InitiateCheckout") ga4EventName = "begin_checkout";
        else if (event_name === "Purchase") ga4EventName = "purchase";
        else if (event_name === "Search") ga4EventName = "search";
        else if (event_name === "Contact") ga4EventName = "generate_lead";
        const ga4Payload = {
          client_id: user_data.fbp || payloadEventId,
          user_id: user_data.phone ? normalizeAndHashPhone(user_data.phone) : user_data.email ? hashMetaField(user_data.email) : user_data.external_id ? hashMetaField(Array.isArray(user_data.external_id) ? user_data.external_id[0] : user_data.external_id) : void 0,
          user_properties: {
            customer_city: user_data.city ? { value: user_data.city } : void 0,
            customer_state: user_data.state || user_data.division ? { value: user_data.state || user_data.division } : void 0,
            customer_country: { value: "BD" }
          },
          events: [
            {
              name: ga4EventName,
              params: {
                currency: custom_data.currency || "BDT",
                value: custom_data.value,
                transaction_id: custom_data.order_id || custom_data.transaction_id,
                shipping: custom_data.shipping,
                tax: custom_data.tax,
                coupon: custom_data.coupon,
                customer_name: user_data.first_name || user_data.last_name || user_data.full_name ? user_data.full_name || `${user_data.first_name || ""} ${user_data.last_name || ""}`.trim() : void 0,
                customer_phone_hash: user_data.phone ? normalizeAndHashPhone(user_data.phone) : void 0,
                items: custom_data.contents?.map((c) => ({
                  item_id: c.id,
                  item_name: c.title || c.content_name,
                  price: c.item_price,
                  quantity: c.quantity || 1,
                  item_category: c.category
                }))
              }
            }
          ]
        };
        const ga4Res = await fetch(ga4Url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ga4Payload)
        });
        ga4ApiResponse = { status: ga4Res.status, ok: ga4Res.ok };
      } catch (ga4Err) {
        ga4ApiResponse = { error: ga4Err.message };
      }
    }
    eventCounts[event_name] = (eventCounts[event_name] || 0) + 1;
    const logEntry = {
      id: payloadEventId,
      eventName: event_name,
      eventId: payloadEventId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
        phonePreview: user_data.phone ? `${user_data.phone.substring(0, 3)}****${user_data.phone.slice(-3)}` : void 0,
        emailPreview: user_data.email ? `${user_data.email.split("@")[0].substring(0, 2)}***@${user_data.email.split("@")[1] || ""}` : void 0,
        fbp: user_data.fbp,
        fbc: user_data.fbc,
        clientIp,
        userAgent: clientUserAgent.substring(0, 50) + "..."
      },
      customData: custom_data,
      status: dispatchStatus,
      metaResponse: metaApiResponse,
      ga4Response: ga4ApiResponse
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
      dataset_id: datasetId ? `${datasetId.substring(0, 4)}***` : "SANDBOX_ACTIVE",
      meta_response: metaApiResponse
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to process tracking event", message: err.message });
  }
});
router.get("/tracking/dataset-status", (req, res) => {
  const datasetId = process.env.META_DATASET_ID || process.env.META_PIXEL_ID;
  const hasAccessToken = Boolean(process.env.META_ACCESS_TOKEN);
  res.json({
    configured: Boolean(datasetId && hasAccessToken),
    datasetId: datasetId ? `${datasetId.substring(0, 4)}***${datasetId.substring(datasetId.length - 3)}` : null,
    pixelId: process.env.VITE_META_PIXEL_ID || datasetId || null,
    isSandboxMode: !Boolean(datasetId && hasAccessToken),
    totalEventsTracked: Object.values(eventCounts).reduce((a, b) => a + b, 0),
    eventBreakdown: eventCounts,
    recentEvents: recentEvents.slice(0, 15)
  });
});
app.use("/api", router);
app.use("/", router);
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.url}`,
    method: req.method,
    url: req.url
  });
});

// src/server/api.ts
var api_default = app;
export {
  api_default as default
};
