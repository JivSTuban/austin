-- Create tables
CREATE TABLE agents (
    encodedZuid VARCHAR PRIMARY KEY,
    name VARCHAR,
    screenName VARCHAR,
    businessName VARCHAR,
    address1 VARCHAR,
    address2 VARCHAR,
    city VARCHAR,
    postalCode VARCHAR,
    state VARCHAR,
    email VARCHAR,
    phoneBusiness VARCHAR,
    phoneCell VARCHAR,
    averageValueThreeYear INTEGER,
    countAllTime INTEGER,
    countLastYear INTEGER,
    priceRangeThreeYearMax INTEGER,
    priceRangeThreeYearMin INTEGER,
    description TEXT,
    languages VARCHAR[],
    specialties VARCHAR[],
    ratingsAverage NUMERIC,
    ratingsCount INTEGER,
    photoUrl VARCHAR,
    brandColor VARCHAR,
    logoUrl VARCHAR
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to agents
CREATE POLICY "Enable read access for all users" ON agents
FOR SELECT
USING (true);

CREATE TABLE reviews (
    reviewId INTEGER PRIMARY KEY,
    encodedZuid VARCHAR REFERENCES agents(encodedZuid),
    reviewerName VARCHAR,
    reviewerScreenName VARCHAR,
    rating INTEGER,
    comment TEXT,
    createDate TIMESTAMP,
    workDescription VARCHAR,
    localKnowledge INTEGER,
    processExpertise INTEGER,
    responsiveness INTEGER,
    negotiationSkills INTEGER,
    reviewerId UUID
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reviews
CREATE POLICY "Enable read access for all users" ON reviews
FOR SELECT
USING (true);
