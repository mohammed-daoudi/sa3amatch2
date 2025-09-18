import { supabase } from '../lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function setupDatabase() {
  console.log('Testing Supabase connection...');

  try {
    // Test connection by checking if we can query
    const { error } = await supabase.from('fields').select('id').limit(1);

    if (error && error.message.includes('does not exist')) {
      console.log('Tables do not exist. Applying migration...');

      // Read the migration file
      const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250429145306_black_shore.sql');
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      // Execute the migration SQL
      const { error: migrationError } = await supabase.rpc('exec_sql', { sql: migrationSQL });

      if (migrationError) {
        console.error('Error applying migration:', migrationError);

        // If rpc doesn't work, try manual approach
        console.log('Trying manual table creation...');
        await createTablesManually();
      } else {
        console.log('Migration applied successfully!');
      }
    } else if (error) {
      console.error('Database connection error:', error);
    } else {
      console.log('Database connection successful! Tables exist.');
    }

    // Test final connection
    const { error: finalError } = await supabase.from('fields').select('count').single();
    if (!finalError) {
      console.log('Database setup complete and verified!');
    }

  } catch (err) {
    console.error('Setup failed:', err);
  }
}

async function createTablesManually() {
  // Create fields table
  const createFields = `
    CREATE TABLE IF NOT EXISTS fields (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      address text NOT NULL,
      price_per_hour integer NOT NULL,
      description text NOT NULL,
      image_url text NOT NULL,
      latitude double precision NOT NULL,
      longitude double precision NOT NULL,
      rating double precision DEFAULT 0,
      amenities text[] DEFAULT '{}',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `;

  try {
    await supabase.rpc('exec_sql', { sql: createFields });
    console.log('Fields table created');
  } catch (error) {
    console.log('Manual table creation approach not available', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase };
