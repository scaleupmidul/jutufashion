import mongoose, { Schema, Document } from 'mongoose';

// ----------------------------------------------------
// 1. Order Model
// ----------------------------------------------------
export interface IOrder extends Document {
  orderNumber: string;
  date?: string;
  items: Array<any>;
  subtotal: number;
  shipping?: number;
  shippingFee?: number;
  discount?: number;
  discountAmount?: number;
  discountCode?: string;
  tax?: number;
  total: number;
  carbonOffsetKg?: number;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    phone: string;
    email?: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    district?: string;
    zipCode?: string;
    country?: string;
    notes?: string;
  };
  shippingMethod?: {
    id: string;
    title: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: any;
  paymentStatus: string;
  advanceAmount?: number;
  advanceAmountPaid?: number;
  transactionId?: string;
  paymentProofUrl?: string;
  senderPhone?: string;
  status: string;
  notes?: string;
  trackingNumber?: string;
  courier?: string;
  courierName?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
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
    paymentStatus: { type: String, default: 'pending_advance' },
    advanceAmount: { type: Number, default: 0 },
    advanceAmountPaid: { type: Number, default: 0 },
    transactionId: { type: String },
    paymentProofUrl: { type: String },
    senderPhone: { type: String },
    status: { type: String, default: 'pending', index: true },
    notes: { type: String },
    trackingNumber: { type: String },
    courier: { type: String },
    courierName: { type: String },
    adminNotes: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// ----------------------------------------------------
// 2. Product Model
// ----------------------------------------------------
export interface IProduct extends Document {
  id: string;
  productId?: string;
  name: string;
  subtitle?: string;
  category: string;
  gender: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isOutOfStock: boolean;
  badge?: string;
  description: string;
  materials: string[];
  material?: string;
  features: string[];
  idealFor?: string;
  buildQuality?: string;
  rating: number;
  reviewCount: number;
  colors: Array<{
    name: string;
    colorCode: string;
    image: string;
    altImages?: string[];
  }>;
  sizes: number[];
  isCustomCreated?: boolean;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, index: true },
    productId: { type: String, index: true },
    name: { type: String, required: true },
    subtitle: { type: String },
    category: { type: String, required: true, index: true },
    gender: { type: String, default: 'unisex' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, default: 20 },
    isOutOfStock: { type: Boolean, default: false },
    badge: { type: String },
    description: { type: String, default: '' },
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
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// ----------------------------------------------------
// 3. Message / Contact Inquiry Model
// ----------------------------------------------------
export interface IMessage extends Document {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  date?: string;
  notes?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'Customer Inquiry' },
    message: { type: String, required: true },
    status: {
      type: String,
      default: 'new',
      index: true,
    },
    date: { type: String },
    notes: { type: String },
    adminNotes: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// ----------------------------------------------------
// 4. Store Settings Model
// ----------------------------------------------------
export interface IStoreSettings extends Document {
  key: string;
  value: Record<string, any>;
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent overwrite model errors on HMR / serverless reload
export const OrderModel: mongoose.Model<IOrder> = 
  (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);

export const ProductModel: mongoose.Model<IProduct> = 
  (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);

export const MessageModel: mongoose.Model<IMessage> = 
  (mongoose.models.Message as mongoose.Model<IMessage>) || mongoose.model<IMessage>('Message', MessageSchema);

export const StoreSettingsModel: mongoose.Model<IStoreSettings> = 
  (mongoose.models.StoreSettings as mongoose.Model<IStoreSettings>) || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);


