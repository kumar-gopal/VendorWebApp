import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensures no duplicate category names
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Self-referencing for nested categories
      default: null, // Null means it's a top-level category
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      url: { type: String, validate: /^https?:\/\// }, // Optional category image
      altText: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin/User who created the category
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure unique category slug
categorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, "-");
  next();
});

const Category = mongoose.model("Category", categorySchema);

export { Category };
