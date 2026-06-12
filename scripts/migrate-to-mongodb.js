const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import models
const Package = require('../lib/models/Package');
const Itinerary = require('../lib/models/Itinerary');

async function migrateToMongoDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read JSON files
    const packagesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/data/packages.json'), 'utf8'));
    const itinerariesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/data/itineraries.json'), 'utf8'));

    // Clear existing data
    await Package.deleteMany({});
    await Itinerary.deleteMany({});
    console.log('Cleared existing data');

    // Migrate packages
    for (const pkg of packagesData) {
      const newPackage = new Package({
        title: pkg.title,
        destination: pkg.destination,
        duration: pkg.duration,
        price: pkg.price,
        image: pkg.image,
        description: pkg.description,
        highlights: pkg.highlights || [],
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        type: pkg.type || 'Standard',
        category: pkg.category || 'destination',
        isActive: true,
        days: pkg.duration ? pkg.duration.split(' ')[0] : '5',
        location: pkg.destination,
        imageType: 'url',
        hotelRating: 4
      });

      await newPackage.save();
      console.log(`Migrated package: ${pkg.title}`);
    }

    // Migrate itineraries
    for (const itinerary of itinerariesData) {
      const newItinerary = new Itinerary({
        packageId: itinerary.packageId,
        title: itinerary.title,
        destination: itinerary.destination,
        duration: itinerary.duration,
        overview: itinerary.overview,
        hotelName: itinerary.hotelName,
        days: itinerary.days || [],
        inclusions: itinerary.inclusions || [],
        exclusions: itinerary.exclusions || [],
        category: itinerary.category || 'destination',
        isActive: true
      });

      await newItinerary.save();
      console.log(`Migrated itinerary: ${itinerary.title}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateToMongoDB();
