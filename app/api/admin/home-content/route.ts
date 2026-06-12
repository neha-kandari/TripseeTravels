import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Get home content
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('homecontent');
    
    // Try to get the latest home content from MongoDB
    let homeContent = await collection.findOne({}, { sort: { createdAt: -1 } });
    
    // If no content exists, create default content
    if (!homeContent) {
      const defaultContent = {
        topDestinations: [
          { name: 'Bali', description: 'Island Paradise', image: '/Destination/Bali.webp', path: '/destination/bali' },
          { name: 'Vietnam', description: 'Timeless Charm', image: '/Destination/Vietnam.webp', path: '/destination/vietnam' },
          { name: 'Singapore', description: 'Modern Marvel', image: '/Destination/Singapore.webp', path: '/destination/singapore' },
          { name: 'Thailand', description: 'Land of Smiles', image: '/Destination/Thailand.webp', path: '/destination/thailand' },
          { name: 'Malaysia', description: 'Cultural Fusion', image: '/Destination/Malasia.webp', path: '/destination/malaysia' },
          { name: 'Dubai', description: 'Desert Dreams', image: '/Destination/Dubai.webp', path: '/destination/dubai' },
          { name: 'Maldives', description: 'Ocean Serenity', image: '/Destination/Maldives.webp', path: '/destination/maldives' },
          { name: 'Andaman', description: 'Tropical Bliss', image: '/Destination/andaman.webp', path: '/destination/andaman' }
        ],
        popularPackages: {
          destinations: [
            {
              name: 'BALI',
              image: '/Destination/Bali.webp',
              packages: [
                {
                  id: 'bali-premium',
                  image: '/Destination/BaliHero/Pura Ulun Danu.webp',
                  days: '5 Nights 6 Days',
                  title: 'PREMIUM PACKAGE - Luxury Villas with Private Pool',
                  location: 'Umalas',
                  price: '₹90,500/-',
                  type: 'Premium',
                  hotelRating: 5,
                  features: [
                    'Private Pool Villa',
                    'Floating Breakfast',
                    'Spa',
                    'All Activities'
                  ],
                  highlights: 'Swiss-Belvillas Umalas • Swan Paradise • Watersports • Nusa Penida Tour'
                },
                {
                  id: 'bali-premium-2',
                  image: '/Destination/BaliHero/Kelingking Beach.webp',
                  days: '5 Nights 6 Days',
                  title: '4 Star Properties Package - Golden Tulip & Desa Swan',
                  location: 'Jineng & Ubud',
                  price: '₹88,220/-',
                  type: 'Premium',
                  hotelRating: 4,
                  features: [
                    '4 Star Hotels',
                    'Private Pool Villa',
                    'All Transfers',
                    'Activities'
                  ],
                  highlights: 'Golden Tulip Jineng • Desa Swan Villa • Watersports • Temple Tours'
                },
                {
                  id: 'bali-premium-3',
                  image: '/Destination/BaliHero/Tirta Empul Temple.webp',
                  days: '6 Nights 7 Days',
                  title: 'PREMIUM OPTION - 5 Star Luxury with Nusa Penida',
                  location: 'Ubud, Nusa Penida & Seminyak',
                  price: '₹1,03,500/-',
                  type: 'Premium',
                  hotelRating: 5,
                  features: [
                    '5 Star Resort',
                    'Island Hopping',
                    'ATV Ride',
                    'Safari'
                  ],
                  highlights: 'Desa Swan Villas • Semabu Hills • Monolocale Luxury Resort • Bali Safari'
                }
              ],
              topDestinations: [
                {
                  name: 'Handara Gate',
                  description: 'Iconic temple gate entrance',
                  image: '/Destination/BaliHero/Handara Gate.webp'
                },
                {
                  name: 'Kelingking Beach',
                  description: 'Dramatic cliff formations',
                  image: '/Destination/BaliHero/Kelingking Beach.webp'
                },
                {
                  name: 'Pura Ulun Danu',
                  description: 'Lake temple serenity',
                  image: '/Destination/BaliHero/Pura Ulun Danu.webp'
                },
                {
                  name: 'Tirta Empul Temple',
                  description: 'Sacred water purification',
                  image: '/Destination/BaliHero/Tirta Empul Temple.webp'
                },
                {
                  name: 'Gates of Heaven',
                  description: 'Lempuyang Temple entrance',
                  image: '/Destination/Bali_images/Gates of Heaven.webp'
                },
                {
                  name: 'Pura Penataran Agung',
                  description: 'Besakih Mother Temple',
                  image: '/Destination/Bali_images/Pura Penataran Agung.webp'
                },
                {
                  name: 'Tirta Empul Temple',
                  description: 'Sacred water purification',
                  image: '/Destination/Bali_images/Tirta Empul Temple.webp'
                },
                {
                  name: 'Pura Ulun Danu',
                  description: 'Lake temple serenity',
                  image: '/Destination/Bali_images/Pura Ulun Danu.webp'
                }
              ]
            },
            {
              name: 'VIETNAM',
              image: '/Destination/Vietnam/haloang bay.webp',
              packages: [
                {
                  id: 'vietnam-classic-1',
                  image: '/Destination/veitnamHero/Halong Bay.webp',
                  days: '6 Nights 7 Days',
                  title: 'CLASSIC VIETNAM - Hanoi, Ha Long & Ho Chi Minh',
                  location: 'North & South Vietnam',
                  price: '₹75,000/-',
                  type: 'Classic',
                  hotelRating: 4,
                  features: [
                    '4 Star Hotels',
                    'Ha Long Cruise',
                    'City Tours',
                    'Local Cuisine'
                  ],
                  highlights: 'Ha Long Bay cruise • Cu Chi Tunnels • Hoi An lanterns • Mekong Delta'
                },
                {
                  id: 'vietnam-cultural-1',
                  image: '/Destination/veitnamHero/Hoi An Lantern.webp',
                  days: '5 Nights 6 Days',
                  title: 'CULTURAL VIETNAM - Heritage & Traditions',
                  location: 'Hanoi, Hoi An & Hue',
                  price: '₹65,000/-',
                  type: 'Cultural',
                  hotelRating: 4,
                  features: [
                    'Heritage Sites',
                    'Cultural Tours',
                    'Local Experiences',
                    'Traditional Shows'
                  ],
                  highlights: 'Imperial City • Ancient temples • Cooking classes • Lantern festival'
                },
                {
                  id: 'vietnam-quick-1',
                  image: '/Destination/veitnamHero/Golden Bridge.webp',
                  days: '4 Nights 5 Days',
                  title: 'QUICK VIETNAM - Highlights Tour',
                  location: 'Hanoi & Ha Long Bay',
                  price: '₹48,000/-',
                  type: 'Quick',
                  hotelRating: 3,
                  features: [
                    'Budget Hotels',
                    'Ha Long Cruise',
                    'Street Food',
                    'City Walking'
                  ],
                  highlights: 'Old Quarter • Water puppets • Ha Long overnight • Local markets'
                }
              ],
              topDestinations: [
                {
                  name: 'Ha Long Bay',
                  description: 'Limestone islands and caves',
                  image: '/Destination/Vietnam/haloang bay.webp'
                },
                {
                  name: 'Hoi An',
                  description: 'Ancient trading port',
                  image: '/Destination/Vietnam/photo-1533497394934-b33cd9695ba9.webp'
                },
                {
                  name: 'Mekong Delta',
                  description: 'Floating markets',
                  image: '/Destination/Vietnam/mekong delta.webp'
                },
                {
                  name: 'Ninh Binh',
                  description: 'Terraced rice fields',
                  image: '/Destination/Vietnam/ninh binh.webp'
                },
                {
                  name: 'Hoan Kiem Lake',
                  description: 'Historic city center',
                  image: '/Destination/Vietnam/hoan kiem lake.webp'
                },
                {
                  name: 'Golden Bridge',
                  description: 'Iconic architectural marvel',
                  image: '/Destination/Vietnam/golden bridge.webp'
                },
                {
                  name: 'Ngoc Son Temple',
                  description: 'Sacred temple on the lake',
                  image: '/Destination/Vietnam/ngoc sun temple.webp'
                },
                {
                  name: 'Phu Quoc Beaches',
                  description: 'Pristine island paradise',
                  image: '/Destination/Vietnam/phu quoc beaches.webp'
                }
              ]
            },
            {
              name: 'SINGAPORE',
              image: '/Destination/Singapore.webp',
              packages: [
                {
                  id: 'singapore-city-1',
                  image: '/Destination/singaporeHero/image1.webp',
                  days: '4 Nights 5 Days',
                  title: 'SINGAPORE CITY EXPLORER - Modern Marvels',
                  location: 'Marina Bay & City Center',
                  price: '₹75,000/-',
                  type: 'City Tour',
                  hotelRating: 4,
                  features: [
                    'City Tours',
                    'Marina Bay Sands',
                    'Gardens by the Bay',
                    'Shopping'
                  ],
                  highlights: 'Marina Bay Sands • Gardens by the Bay • Orchard Road • Sentosa Island'
                },
                {
                  id: 'singapore-family-1',
                  image: '/Destination/singaporeHero/image2.webp',
                  days: '5 Nights 6 Days',
                  title: 'FAMILY SINGAPORE - Universal Studios & Fun',
                  location: 'Sentosa Island & City',
                  price: '₹85,000/-',
                  type: 'Family',
                  hotelRating: 4,
                  features: [
                    'Universal Studios',
                    'Adventure Cove',
                    'S.E.A. Aquarium',
                    'Family Hotels'
                  ],
                  highlights: 'Universal Studios • Adventure Cove • S.E.A. Aquarium • Family activities'
                },
                {
                  id: 'singapore-luxury-1',
                  image: '/Destination/singaporeHero/image3.webp',
                  days: '6 Nights 7 Days',
                  title: 'LUXURY SINGAPORE - Premium Experience',
                  location: 'Marina Bay & Luxury Districts',
                  price: '₹1,25,000/-',
                  type: 'Luxury',
                  hotelRating: 5,
                  features: [
                    '5 Star Hotels',
                    'Private Tours',
                    'Fine Dining',
                    'Luxury Spa'
                  ],
                  highlights: 'Marina Bay Sands • Raffles Hotel • Fine dining • Luxury experiences'
                }
              ],
              topDestinations: [
                {
                  name: 'Marina Bay Sands',
                  description: 'Iconic hotel and skyline',
                  image: '/Destination/Singapore/marina bay sands.webp'
                },
                {
                  name: 'Supertree Grove',
                  description: 'Gardens by the Bay',
                  image: '/Destination/Singapore/supertree.webp'
                },
                {
                  name: 'Universal Studios',
                  description: 'Sentosa Island adventure',
                  image: '/Destination/Singapore/universal studios.webp'
                },
                {
                  name: 'Chinatown',
                  description: 'Cultural heritage district',
                  image: '/Destination/Singapore/Chinatown.webp'
                },
                {
                  name: 'Singapore Flyer',
                  description: 'Giant observation wheel',
                  image: '/Destination/Singapore/singapore flyer.webp'
                },
                {
                  name: 'Helix Bridge',
                  description: 'Iconic pedestrian bridge',
                  image: '/Destination/Singapore/helix brigde.webp'
                },
                {
                  name: 'Cloud Forest',
                  description: 'Misty mountain ecosystem',
                  image: '/Destination/Singapore/cloud forest.webp'
                },
                {
                  name: 'Art Science Museum',
                  description: 'Marina Bay waterfront',
                  image: '/Destination/Singapore/art science museum and marina bay stands.webp'
                }
              ]
            },
            {
              name: 'THAILAND',
              image: '/Destination/Thailand.webp',
              packages: [
                {
                  id: 'thailand-bangkok-1',
                  image: '/Destination/ThailandHero/image1.webp',
                  days: '5 Nights 6 Days',
                  title: 'BANGKOK & PHUKET - City & Beach Combo',
                  location: 'Bangkok & Phuket',
                  price: '₹65,000/-',
                  type: 'Classic',
                  hotelRating: 4,
                  features: [
                    'City Tours',
                    'Beach Time',
                    'Temple Visits',
                    'Island Hopping'
                  ],
                  highlights: 'Grand Palace • Wat Phra Kaew • Patong Beach • Phi Phi Islands'
                },
                {
                  id: 'thailand-cultural-1',
                  image: '/Destination/ThailandHero/image2.webp',
                  days: '6 Nights 7 Days',
                  title: 'CULTURAL THAILAND - Temples & Traditions',
                  location: 'Bangkok, Ayutthaya & Chiang Mai',
                  price: '₹72,000/-',
                  type: 'Cultural',
                  hotelRating: 4,
                  features: [
                    'Temple Tours',
                    'Cultural Shows',
                    'Local Markets',
                    'Traditional Crafts'
                  ],
                  highlights: 'Wat Arun • Ayutthaya ruins • Doi Suthep • Night Bazaar'
                },
                {
                  id: 'thailand-luxury-1',
                  image: '/Destination/ThailandHero/image3.webp',
                  days: '7 Nights 8 Days',
                  title: 'LUXURY THAILAND - Premium Experience',
                  location: 'Bangkok, Phuket & Koh Samui',
                  price: '₹95,000/-',
                  type: 'Luxury',
                  hotelRating: 5,
                  features: [
                    '5 Star Hotels',
                    'Private Tours',
                    'Luxury Spa',
                    'Fine Dining'
                  ],
                  highlights: 'Luxury resorts • Private beaches • Premium spa • Exclusive experiences'
                }
              ],
              topDestinations: [
                {
                  name: 'Grand Palace',
                  description: 'Royal palace complex',
                  image: '/Destination/Thailand/grand palace.webp'
                },
                {
                  name: 'Wat Pho',
                  description: 'Reclining Buddha temple',
                  image: '/Destination/Thailand/wat pho.webp'
                },
                {
                  name: 'Wat Arun',
                  description: 'Temple of Dawn',
                  image: '/Destination/Thailand/wat arun temple.webp'
                },
                {
                  name: 'Doi Suthep',
                  description: 'Mountain temple in Chiang Mai',
                  image: '/Destination/Thailand/doi suthep temple.webp'
                },
                {
                  name: 'Phi Phi Islands',
                  description: 'Crystal clear waters',
                  image: '/Destination/Thailand/phi phi island.webp'
                },
                {
                  name: 'Ayutthaya',
                  description: 'Ancient capital ruins',
                  image: '/Destination/Thailand/grand palace.webp'
                },
                {
                  name: 'Chiang Mai Night Bazaar',
                  description: 'Cultural market experience',
                  image: '/Destination/Thailand/railay beach.webp'
                },
                {
                  name: 'Railay Beach',
                  description: 'Rock climbing paradise',
                  image: '/Destination/Thailand/railay beach.webp'
                }
              ]
            },
            {
              name: 'MALAYSIA',
              image: '/Destination/Malasia.webp',
              packages: [
                {
                  id: 'malaysia-kl-1',
                  image: '/Destination/MalaysiaHero/img1.webp',
                  days: '5 Nights 6 Days',
                  title: 'KUALA LUMPUR & LANGKAWI - City & Island',
                  location: 'KL City & Langkawi Island',
                  price: '₹65,000/-',
                  type: 'City & Beach',
                  hotelRating: 4,
                  features: [
                    'Petronas Towers',
                    'Langkawi Island',
                    'City Tours',
                    'Beach Time'
                  ],
                  highlights: 'Petronas Towers • Langkawi beaches • City shopping • Island activities'
                },
                {
                  id: 'malaysia-cultural-1',
                  image: '/Destination/MalaysiaHero/img2.webp',
                  days: '6 Nights 7 Days',
                  title: 'CULTURAL MALAYSIA - Heritage & Traditions',
                  location: 'Penang, Malacca & KL',
                  price: '₹75,000/-',
                  type: 'Cultural',
                  hotelRating: 4,
                  features: [
                    'Heritage Sites',
                    'Cultural Tours',
                    'Local Markets',
                    'Traditional Food'
                  ],
                  highlights: 'Penang heritage • Malacca history • KL culture • Local experiences'
                },
                {
                  id: 'malaysia-nature-1',
                  image: '/Destination/MalaysiaHero/img3.webp',
                  days: '5 Nights 6 Days',
                  title: 'NATURE MALAYSIA - Cameron Highlands & KL',
                  location: 'Cameron Highlands & Kuala Lumpur',
                  price: '₹70,000/-',
                  type: 'Nature',
                  hotelRating: 4,
                  features: [
                    'Tea Plantations',
                    'Mountain Views',
                    'City Tours',
                    'Nature Walks'
                  ],
                  highlights: 'Cameron Highlands • Tea plantations • Mountain trekking • KL city'
                }
              ],
              topDestinations: [
                {
                  name: 'Petronas Twin Towers',
                  description: 'Iconic twin skyscrapers in KL',
                  image: '/Destination/Malaysia/petronas-twin-towers.webp'
                },
                {
                  name: 'Batu Caves',
                  description: 'Hindu temple complex in Selangor',
                  image: '/Destination/Malaysia/batu-caves.webp'
                },
                {
                  name: 'Cameron Highlands',
                  description: 'Tea plantations and cool climate',
                  image: '/Destination/Malaysia/cameron-highlands.webp'
                },
                {
                  name: 'Malacca',
                  description: 'UNESCO heritage site',
                  image: '/Destination/Malaysia/malacca.webp'
                },
                {
                  name: 'Tioman Island',
                  description: 'Paradise for divers',
                  image: '/Destination/Malaysia/tioman-island.webp'
                },
                {
                  name: 'Kapas Island',
                  description: 'Terengganu island beauty',
                  image: '/Destination/Malaysia/kapas-island.webp'
                },
                {
                  name: 'Manukan Island',
                  description: 'Sabah island paradise',
                  image: '/Destination/Malaysia/manukan-island.webp'
                },
                {
                  name: 'Ipoh',
                  description: 'Colonial charm and cave temples',
                  image: '/Destination/Malaysia/ipoh-perak.webp'
                }
              ]
            },
            {
              name: 'DUBAI',
              image: '/Destination/Dubai.webp',
              packages: [
                {
                  id: 'dubai-luxury-1',
                  image: '/Destination/DubaiHero/Burj Khalifa.webp',
                  days: '5 Nights 6 Days',
                  title: 'LUXURY DUBAI - Premium Experience',
                  location: 'Downtown Dubai & Palm Jumeirah',
                  price: '₹95,000/-',
                  type: 'Luxury',
                  hotelRating: 5,
                  features: [
                    'Burj Khalifa',
                    'Palm Jumeirah',
                    'Luxury Hotels',
                    'Premium Tours'
                  ],
                  highlights: 'Burj Khalifa • Palm Jumeirah • Luxury hotels • Premium experiences'
                },
                {
                  id: 'dubai-adventure-1',
                  image: '/Destination/DubaiHero/Desert Safari.webp',
                  days: '6 Nights 7 Days',
                  title: 'ADVENTURE DUBAI - Desert & City',
                  location: 'Dubai City & Desert',
                  price: '₹85,000/-',
                  type: 'Adventure',
                  hotelRating: 4,
                  features: [
                    'Desert Safari',
                    'City Tours',
                    'Adventure Sports',
                    'Cultural Tours'
                  ],
                  highlights: 'Desert safari • City exploration • Adventure sports • Cultural experiences'
                },
                {
                  id: 'dubai-family-1',
                  image: '/Destination/DubaiHero/Dubai Fountain.webp',
                  days: '7 Nights 8 Days',
                  title: 'FAMILY DUBAI - Fun for Everyone',
                  location: 'Dubai Parks & City',
                  price: '₹1,05,000/-',
                  type: 'Family',
                  hotelRating: 4,
                  features: [
                    'Dubai Parks',
                    'Aquarium',
                    'Shopping',
                    'Family Activities'
                  ],
                  highlights: 'Dubai Parks • Dubai Aquarium • Shopping malls • Family fun'
                }
              ],
              topDestinations: [
                {
                  name: 'Burj Khalifa',
                  description: 'World\'s tallest building',
                  image: '/Destination/Dubai_images/Burj Khalifa.webp'
                },
                {
                  name: 'Burj Al Arab Jumeirah',
                  description: 'Luxury sail-shaped hotel',
                  image: '/Destination/Dubai_images/Burj AI Arab Jumeirah.webp'
                },
                {
                  name: 'Dubai Mall',
                  description: 'Shopping paradise',
                  image: '/Destination/Dubai_images/Dubai Mall.webp'
                },
                {
                  name: 'Desert Safari',
                  description: 'Dune bashing adventure',
                  image: '/Destination/Dubai_images/Desert Safari.webp'
                },
                {
                  name: 'Dubai Frame',
                  description: 'Golden frame monument',
                  image: '/Destination/Dubai_images/Dubai Frame.webp'
                },
                {
                  name: 'Dubai Skyline',
                  description: 'Iconic city panorama',
                  image: '/Destination/Dubai_images/Dubai Skyline.webp'
                },
                {
                  name: 'Dubai Fountain',
                  description: 'World\'s largest choreographed fountain',
                  image: '/Destination/Dubai_images/Dubai Fountain.webp'
                },
                {
                  name: 'Ain Dubai',
                  description: 'World\'s largest observation wheel',
                  image: '/Destination/Dubai_images/Ain Dubai.webp'
                }
              ]
            },
            {
              name: 'MALDIVES',
              image: '/Destination/Maldives.webp',
              packages: [
                {
                  id: 'maldives-luxury-1',
                  image: '/Destination/MaldivesHero/hanifaru-bay.webp',
                  days: '4 Nights 5 Days',
                  title: 'LUXURY MALDIVES - Overwater Villa Experience',
                  location: 'Male & Resort Islands',
                  price: '₹1,25,000/-',
                  type: 'Luxury',
                  hotelRating: 5,
                  features: [
                    'Overwater Villa',
                    'All Inclusive',
                    'Water Sports',
                    'Spa'
                  ],
                  highlights: 'Private overwater villa • All meals included • Water sports • Luxury spa'
                },
                {
                  id: 'maldives-romantic-1',
                  image: '/Destination/MaldivesHero/male-atoll.webp',
                  days: '5 Nights 6 Days',
                  title: 'ROMANTIC MALDIVES - Honeymoon Special',
                  location: 'Private Island Resort',
                  price: '₹1,45,000/-',
                  type: 'Honeymoon',
                  hotelRating: 5,
                  features: [
                    'Private Island',
                    'Honeymoon Suite',
                    'Romantic Dinners',
                    'Couple Spa'
                  ],
                  highlights: 'Private island access • Honeymoon suite • Romantic dinners • Couple spa'
                },
                {
                  id: 'maldives-adventure-1',
                  image: '/Destination/MaldivesHero/gulhi-falhu.webp',
                  days: '6 Nights 7 Days',
                  title: 'ADVENTURE MALDIVES - Water Sports & Diving',
                  location: 'Multiple Islands',
                  price: '₹1,35,000/-',
                  type: 'Adventure',
                  hotelRating: 4,
                  features: [
                    'Water Sports',
                    'Scuba Diving',
                    'Island Hopping',
                    'Adventure Activities'
                  ],
                  highlights: 'Scuba diving • Water sports • Island hopping • Adventure activities'
                }
              ],
              topDestinations: [
                {
                  name: 'Conrad Maldives Rangali Island',
                  description: 'Luxury overwater resort',
                  image: '/Destination/Maldives/conrad-maldives.webp'
                },
                {
                  name: 'Gulhi Falhu',
                  description: 'Pristine island paradise',
                  image: '/Destination/MaldivesHero/gulhi-falhu.webp'
                },
                {
                  name: 'Meedhoo, Raa Atoll',
                  description: 'Remote island beauty',
                  image: '/Destination/Maldives/meedhoo-raa-atoll.webp'
                },
                {
                  name: 'Hanifaru Bay',
                  description: 'Baa Atoll whale shark haven',
                  image: '/Destination/MaldivesHero/hanifaru-bay.webp'
                },
                {
                  name: 'North Malé Atoll',
                  description: 'Crystal clear waters',
                  image: '/Destination/Maldives/north-male-atoll.webp'
                },
                {
                  name: 'Ari Atoll',
                  description: 'Diving and snorkeling paradise',
                  image: '/Destination/Maldives/ari-atoll.webp'
                },
                {
                  name: 'Baa Atoll',
                  description: 'UNESCO Biosphere Reserve',
                  image: '/Destination/Maldives/baa-atoll.webp'
                },
                {
                  name: 'Malé Atoll',
                  description: 'Kaafu Atoll capital region',
                  image: '/Destination/MaldivesHero/male-atoll.webp'
                }
              ]
            },
            {
              name: 'ANDAMANS',
              image: '/Destination/andaman.webp',
              packages: [
                {
                  id: 'andaman-havelock-1',
                  image: '/Destination/AndamanHero/image1.webp',
                  days: '5 Nights 6 Days',
                  title: 'HAVELOCK ISLAND - Beach Paradise',
                  location: 'Havelock Island & Port Blair',
                  price: '₹55,000/-',
                  type: 'Beach',
                  hotelRating: 4,
                  features: [
                    'Radhanagar Beach',
                    'Water Sports',
                    'Island Tours',
                    'Beach Resorts'
                  ],
                  highlights: 'Radhanagar Beach • Water sports • Island tours • Beach resorts'
                },
                {
                  id: 'andaman-cultural-1',
                  image: '/Destination/AndamanHero/image2.webp',
                  days: '6 Nights 7 Days',
                  title: 'CULTURAL ANDAMAN - History & Nature',
                  location: 'Port Blair & Neil Island',
                  price: '₹65,000/-',
                  type: 'Cultural',
                  hotelRating: 4,
                  features: [
                    'Cellular Jail',
                    'Historical Tours',
                    'Neil Island',
                    'Cultural Shows'
                  ],
                  highlights: 'Cellular Jail • Historical tours • Neil Island • Cultural shows'
                },
                {
                  id: 'andaman-adventure-1',
                  image: '/Destination/AndamanHero/image3.webp',
                  days: '7 Nights 8 Days',
                  title: 'ADVENTURE ANDAMAN - Water Sports & Trekking',
                  location: 'Multiple Islands',
                  price: '₹75,000/-',
                  type: 'Adventure',
                  hotelRating: 4,
                  features: [
                    'Scuba Diving',
                    'Trekking',
                    'Island Hopping',
                    'Adventure Sports'
                  ],
                  highlights: 'Scuba diving • Trekking • Island hopping • Adventure sports'
                }
              ],
              topDestinations: [
                {
                  name: 'Havelock Island',
                  description: 'Swaraj Dweep paradise',
                  image: '/Destination/Andamans/havelock-island.webp'
                },
                {
                  name: 'Neil Island',
                  description: 'Shaheed Dweep beauty',
                  image: '/Destination/Andamans/neil-island.webp'
                },
                {
                  name: 'Baratang Island',
                  description: 'Limestone caves and mud volcanoes',
                  image: '/Destination/Andamans/baratang-island.webp'
                },
                {
                  name: 'Ross Island',
                  description: 'Netaji Subhash Chandra Bose Island',
                  image: '/Destination/Andamans/ross-island.webp'
                },
                {
                  name: 'North Bay Island',
                  description: 'Water sports and coral reefs',
                  image: '/Destination/Andamans/north-bay-island.webp'
                },
                {
                  name: 'Cinque Island',
                  description: 'Pristine island getaway',
                  image: '/Destination/Andamans/cinque-island.webp'
                },
                {
                  name: 'Cellular Jail',
                  description: 'Port Blair historical landmark',
                  image: '/Destination/Andamans/cellular-jail.webp'
                },
                {
                  name: 'Samudrika Marine Museum',
                  description: 'Marine life exhibition',
                  image: '/Destination/Andamans/samudrika-museum.webp'
                }
              ]
            }
          ]
        }
      };
      
      // Create and save default content
      await collection.insertOne({
        ...defaultContent,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      homeContent = { ...defaultContent, _id: null };
    }
    
    return NextResponse.json(homeContent);
  } catch (error) {
    console.error('Error reading home content:', error);
    return NextResponse.json({ error: 'Failed to read home content' }, { status: 500 });
  }
}

// Update home content
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('homecontent');
    
    const body = await request.json();
    const { topDestinations, popularPackages } = body;
    
    // Validate the data structure
    if (!topDestinations || !popularPackages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const content = {
      topDestinations,
      popularPackages,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create new home content document
    await collection.insertOne(content);
    
    return NextResponse.json({ message: 'Home content updated successfully' });
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json({ error: 'Failed to update home content' }, { status: 500 });
  }
} 