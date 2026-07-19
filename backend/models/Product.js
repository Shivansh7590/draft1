import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  color: String,
  storage: String,
  priceModifier: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['laptops', 'desktops', 'smart-watches', 'earbuds', 'headphones', 'accessories', 'gadgets'],
    },
    images: [{ type: String }],
    variants: [variantSchema],
    specs: { type: Map, of: String },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    featured: { type: Boolean, default: false },
    configurator: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
