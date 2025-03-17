-- Create listings table
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    address VARCHAR NOT NULL,
    price INTEGER,
    beds INTEGER,
    baths INTEGER,
    sqft INTEGER,
    zillow_link VARCHAR,
    imageLink VARCHAR,
    last_updated_from_zillow TIMESTAMP
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to listings
CREATE POLICY "Enable read access for all users" ON listings
FOR SELECT
USING (true);

-- Allow authenticated users to modify listings
CREATE POLICY "Enable full access for authenticated users" ON listings
FOR ALL
USING (auth.role() = 'authenticated');
