#!/bin/bash

# Create .env file with Supabase credentials
# Run this script: ./create-env.sh

echo "Creating .env file with your Supabase credentials..."

cat > .env << EOF
VITE_SUPABASE_URL=https://cgrgxqrgowevvjpjbjkk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncmd4cXJnb3dldnZqcGpiamtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NDIxMTQsImV4cCI6MjA2NzIxODExNH0.3NnolMMDm2RzTwFo85ztRB-XEngpkaQgPNMLHYZ3Jts
EOF

echo "✅ .env file created successfully!"
echo "Your Supabase credentials have been configured."
echo ""
echo "Next steps:"
echo "1. Run the SQL script in your Supabase dashboard"
echo "2. Start the dev server: npm run dev" 