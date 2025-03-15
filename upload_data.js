import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adzokgnahnkjoubwryhj.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkem9rZ25haG5ram91YndyeWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1Nzk4MTMsImV4cCI6MjA1NzE1NTgxM30.OeW5BTQphpXYZhyun7OnGgdeq71hcduW0J83wIBxrhM'
const supabase = createClient(supabaseUrl, supabaseKey)

function parseArrayField(field) {
  try {
    return JSON.parse(field.replace(/"{2}/g, '"'));
  } catch (e) {
    return [];
  }
}

async function uploadData() {
  try {
    // First refresh the connection to clear any cached schema
    await supabase.auth.refreshSession();

    // Read and parse profile.csv
    const profileData = fs.readFileSync('profile.csv', 'utf8');
    const profiles = parse(profileData, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      trim: true
    });

    // Insert data into agents table using upsert
    const { error: profileError } = await supabase
      .from('agents')
      .upsert(
        profiles.map(row => ({
          encodedZuid: row.encodedZuid,
          name: row.name,
          screenName: row.screenName,
          businessName: row.businessName,
          address1: row.address1,
          address2: row.address2 || null,
          city: row.city,
          postalCode: row.postalCode,
          state: row.state,
          email: row.email,
          phoneBusiness: row.phoneBusiness || null,
          phoneCell: row.phoneCell,
          averageValueThreeYear: parseInt(row.averageValueThreeYear),
          countAllTime: parseInt(row.countAllTime),
          countLastYear: parseInt(row.countLastYear),
          priceRangeThreeYearMax: parseInt(row.priceRangeThreeYearMax),
          priceRangeThreeYearMin: parseInt(row.priceRangeThreeYearMin),
          description: row.description,
          languages: parseArrayField(row.languages),
          specialties: parseArrayField(row.specialties),
          ratingsAverage: parseFloat(row.ratingsAverage),
          ratingsCount: parseInt(row.ratingsCount),
          photoUrl: row.photoUrl,
          brandColor: row.brandColor,
          logoUrl: row.logoUrl
        }))
      )
      .select();

    if (profileError) {
      console.error('Error inserting profile data:', profileError);
      return;
    }

    // Read and parse reviews.csv
    const reviewsData = fs.readFileSync('reviews.csv', 'utf8');
    const reviews = parse(reviewsData, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      trim: true
    });

    // Insert data into reviews table using upsert
    for (const row of reviews) {
      const { error: reviewError } = await supabase
        .from('reviews')
        .upsert([
          {
            reviewId: parseInt(row.reviewId),
            encodedZuid: row.encodedZuid,
            reviewerName: row.reviewerName,
            reviewerScreenName: row.reviewerScreenName,
            rating: parseInt(row.rating),
            comment: row.comment,
            createDate: new Date(row.createDate).toISOString(),
            workDescription: row.workDescription,
            localKnowledge: parseInt(row.localKnowledge),
            processExpertise: parseInt(row.processExpertise),
            responsiveness: parseInt(row.responsiveness),
            negotiationSkills: parseInt(row.negotiationSkills),
            reviewerId: null // You'll need to populate this with the actual UUID from auth.users table
          },
        ])
        .select();

      if (reviewError) {
        console.error('Error inserting review data:', reviewError);
      }
    }

    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error reading or processing data:', error);
  }
}

uploadData();
