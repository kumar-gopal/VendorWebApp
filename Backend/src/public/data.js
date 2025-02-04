import { Product } from "../model/product.model.js";
const products = [
    {
      "name": "Novel",
      "description": "Bestselling fiction novel",
      "price": 14.99,
      "stockQuantity": 200,
      "imageUrl": "https://example.com/novel.jpg"
    },
    {
      "name": "Cookbook",
      "description": "Recipe book for healthy meals",
      "price": 19.99,
      "stockQuantity": 150,
      "imageUrl": "https://example.com/cookbook.jpg"
    },
    {
      "name": "Textbook",
      "description": "College-level biology textbook",
      "price": 49.99,
      "stockQuantity": 80,
      "imageUrl": "https://example.com/textbook.jpg"
    },
    {
      "name": "Children's Book",
      "description": "Illustrated storybook for kids",
      "price": 9.99,
      "stockQuantity": 300,
      "imageUrl": "https://example.com/childrensbook.jpg"
    },
    {
      "name": "Self-Help Book",
      "description": "Motivational self-help book",
      "price": 19.99,
      "stockQuantity": 120,
      "imageUrl": "https://example.com/selfhelpbook.jpg"
    },
    {
      "name": "Travel Guide",
      "description": "Guidebook for international travel",
      "price": 24.99,
      "stockQuantity": 90,
      "imageUrl": "https://example.com/travelguide.jpg"
    },
    {
      "name": "Mystery Novel",
      "description": "Thrilling mystery story",
      "price": 14.99,
      "stockQuantity": 200,
      "imageUrl": "https://example.com/mysterynovel.jpg"
    },
    {
      "name": "Biography",
      "description": "Life story of a famous personality",
      "price": 29.99,
      "stockQuantity": 100,
      "imageUrl": "https://example.com/biography.jpg"
    },
    {
      "name": "Art Book",
      "description": "Book showcasing famous artworks",
      "price": 34.99,
      "stockQuantity": 70,
      "imageUrl": "https://example.com/artbook.jpg"
    },
    {
      "name": "Science Fiction",
      "description": "Futuristic sci-fi novel",
      "price": 14.99,
      "stockQuantity": 200,
      "imageUrl": "https://example.com/sciencefiction.jpg"
    }
  ]
const newproducts = products.map((p) => ({
    ...p,
    category: "Books"
}));

const insertproduct = async (newproducts) => {
    try {
        await Product.insertMany(newproducts);
        console.log("Products inserted successfully");
    } catch (error) {
        console.error("Error inserting products:", error);
    }
};

// Call the function and pass `newproducts` as an argument
// insertproduct(newproducts);
export {insertproduct,newproducts}

// console.log(newproducts);

