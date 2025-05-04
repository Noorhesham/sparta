# Database Migration Scripts

This directory contains scripts to help with database migrations and fixes.

## Fix Product Slugs Script

The `fix-product-slugs.js` script is designed to fix products with null or missing slugs in the database. This addresses the "E11000 duplicate key error" that occurs when trying to create new products.

### How to Run

1. Make sure your `.env` file contains the correct `MONGODB_URI` variable
2. Run the script using Node.js:

```bash
node scripts/fix-product-slugs.js
```

### What the Script Does

- Connects to your MongoDB database
- Finds all products with null or missing slugs
- Generates unique slugs based on the product names
- Updates the products in the database
- Logs the changes made

After running this script, you should no longer encounter the duplicate key error for slugs when creating new products.
