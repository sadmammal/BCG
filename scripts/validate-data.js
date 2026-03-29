import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the schema based on our JSON structure
const RestaurantSchema = z.object({
  id: z.string().min(1, "ID cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }),
  category: z.array(z.string()).min(1, "At least one category is required"),
  description: z.string(),
  price_range: z.enum(['Low', 'Medium', 'Medium-High', 'High']),
  address: z.string().min(1, "Address cannot be empty")
});

const DatabaseSchema = z.array(RestaurantSchema);

function validate() {
  const dataPath = path.join(__dirname, '../src/data/restaurant.json');
  console.log(`Validating ${dataPath}...`);
  
  try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    
    // Parse and validate using Zod
    DatabaseSchema.parse(jsonData);
    console.log('✅ Validation successful! Data structure is correct.');
    process.exit(0);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation failed! Found the following errors:');
      error.errors.forEach(err => {
        // Build a readable path like [3].coordinates.lng
        const pathStr = err.path.map(p => typeof p === 'number' ? `[${p}]` : `.${p}`).join('');
        console.error(` - Error at items${pathStr}: ${err.message}`);
      });
    } else {
      console.error('❌ Failed to read or parse JSON file:');
      console.error(error.message);
    }
    process.exit(1);
  }
}

validate();
