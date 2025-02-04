import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    baseDetails: {
      brand: { type: String, required: true, trim: true },
      price: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "USD" }, // Optional, for multi-currency support
      stock: { type: Number, required: true, min: 0, default: 0 },
    },
    customAttributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allows dynamic fields per category
      default: {}, // Ensures no null value issues
    },
    images: [
      {
        url: { type: String, required: true, validate: /^https?:\/\// }, // Ensures a valid URL
        altText: { type: String, trim: true },
        isPrimary: { type: Boolean, default: false }, // Allows marking a primary image
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Draft"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// ✅ Convert to Static Methods (Model-Level Operations)
productSchema.statics.findByProductId = async function (id) {
  return await this.findById(id);
};

productSchema.statics.findAllProducts = async function () {
  return await this.find();
};

productSchema.statics.deleteProductById = async function (id) {
  return await this.findByIdAndDelete(id);
};

productSchema.statics.updateProductById = async function (id, update) {
  return await this.findByIdAndUpdate(id, update, { new: true, runValidators: true });
};


productSchema.index({ name: "text", "baseDetails.brand": "text" });
productSchema.index({ "baseDetails.price": 1, "baseDetails.stock": -1 });
productSchema.index({ category: 1, status: 1 });

const Product = mongoose.model("Product", productSchema);

export { Product };
