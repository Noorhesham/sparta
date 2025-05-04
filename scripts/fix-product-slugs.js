// Migration script to fix products with null slugs
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Simple Product schema for the migration
const ProductSchema = new mongoose.Schema({
  project_name: String,
  slug: String,
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// Create unique slugs from project names
async function generateUniqueSlug(productName, existingSlugs, id = null) {
  // Create base slug from product name
  let baseSlug = productName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists (skipping the current product)
  while (existingSlugs.some(item => item.slug === slug && (!id || item._id.toString() !== id))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// Update all products with null or duplicate slugs
async function fixProductSlugs() {
  try {
    // Get all products
    const products = await Product.find().lean();
    
    // Create a map of existing slugs
    const existingSlugs = products.filter(p => p.slug).map(p => ({ 
      _id: p._id, 
      slug: p.slug 
    }));
    
    let updates = 0;
    
    // Update products with null or empty slugs
    for (const product of products) {
      if (!product.slug && product.project_name) {
        const uniqueSlug = await generateUniqueSlug(product.project_name, existingSlugs, product._id);
        
        await Product.updateOne(
          { _id: product._id },
          { $set: { slug: uniqueSlug } }
        );
        
        existingSlugs.push({ _id: product._id, slug: uniqueSlug });
        updates++;
        
        console.log(`Updated product ${product._id}: ${product.project_name} => ${uniqueSlug}`);
      }
    }
    
    console.log(`Updated ${updates} products with new slugs`);
  } catch (error) {
    console.error('Error updating products:', error);
  }
}

// Run the migration
async function runMigration() {
  await connectToDatabase();
  
  try {
    await fixProductSlugs();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

runMigration(); 