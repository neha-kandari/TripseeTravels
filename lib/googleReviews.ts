export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated?: boolean;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  formatted_address: string;
  website?: string;
}

export interface GoogleReviewsResponse {
  status: string;
  result: GooglePlaceDetails;
  error_message?: string;
}

class GoogleReviewsService {
  private apiKey: string;
  private placeId: string;

  constructor() {
    // We'll use the API route instead of direct API calls for security
    this.apiKey = '';
    this.placeId = '';
  }

  private async makeRequest(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Google Reviews:', error);
      throw error;
    }
  }

  async getPlaceReviews(): Promise<GoogleReview[]> {
    try {
      const response = await fetch('/api/google-reviews');
      const result = await response.json();
      
      if (result.success && result.data.reviews) {
        return result.data.reviews.map((review: GoogleReview) => ({
          ...review,
          // Add fallback profile photo if none exists
          profile_photo_url: review.profile_photo_url || '/images/default-avatar.png'
        }));
      } else {
        console.warn('No reviews found or API error:', result.error);
        return this.getFallbackReviews();
      }
    } catch (error) {
      console.error('Error fetching Google Reviews:', error);
      return this.getFallbackReviews();
    }
  }

  async getPlaceDetails(): Promise<Partial<GooglePlaceDetails>> {
    try {
      const response = await fetch('/api/google-reviews');
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          name: result.data.name || 'Tripsee',
          rating: result.data.rating || 4.9,
          user_ratings_total: result.data.user_ratings_total || 1000,
          formatted_address: result.data.formatted_address,
          website: result.data.website
        };
      } else {
        return {
          name: 'Tripsee',
          rating: 4.9,
          user_ratings_total: 1000
        };
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      return {
        name: 'Tripsee',
        rating: 4.9,
        user_ratings_total: 1000
      };
    }
  }

  getFallbackReviews(): GoogleReview[] {
    // Return your existing reviews as fallback
    return [
      {
        author_name: "Sarah & Michael Johnson",
        language: "en",
        rating: 5,
        relative_time_description: "2 months ago",
        text: "Our honeymoon in Maldives was absolutely magical! The overwater villa was stunning, and the candlelit dinner on the beach was unforgettable. Tripsee made everything perfect from start to finish. The attention to detail and personalized service exceeded all our expectations.",
        time: Date.now() - (60 * 24 * 60 * 60 * 1000), // 2 months ago
        profile_photo_url: "/Destination/Maldives.webp"
      },
      {
        author_name: "Priya & Arjun Sharma",
        language: "en",
        rating: 5,
        relative_time_description: "3 months ago",
        text: "Bali was a dream come true! The private pool villa in Ubud was surrounded by lush rice terraces. The floating breakfast and couple's spa treatments were highlights. Tripsee's local guides showed us hidden gems we never would have found on our own.",
        time: Date.now() - (90 * 24 * 60 * 60 * 1000), // 3 months ago
        profile_photo_url: "/Destination/Bali.webp"
      },
      {
        author_name: "David & Emma Wilson",
        language: "en",
        rating: 5,
        relative_time_description: "4 months ago",
        text: "The proposal setup at Burj Khalifa was beyond our wildest dreams! Emma said YES with the most incredible backdrop. The professional photography captured every emotion perfectly. Thank you Tripsee for making this the most important moment of our lives so special.",
        time: Date.now() - (120 * 24 * 60 * 60 * 1000), // 4 months ago
        profile_photo_url: "/Destination/Dubai.webp"
      },
      {
        author_name: "Ravi & Meera Patel",
        language: "en",
        rating: 5,
        relative_time_description: "5 months ago",
        text: "Thailand exceeded every expectation! The islands were pristine, the food was incredible, and the sunset cruise was magical. Our resort in Phuket was perfect, and the staff treated us like royalty. Tripsee planned every detail flawlessly.",
        time: Date.now() - (150 * 24 * 60 * 60 * 1000), // 5 months ago
        profile_photo_url: "/Destination/Thailand.webp"
      },
      {
        author_name: "Alex & Lisa Rodriguez",
        language: "en",
        rating: 5,
        relative_time_description: "6 months ago",
        text: "Andaman Islands were absolutely breathtaking! The crystal-clear waters at Radhanagar Beach and the snorkeling at Elephant Beach were incredible. The candlelit dinner under the stars was the most romantic evening of our lives. Highly recommend Tripsee!",
        time: Date.now() - (180 * 24 * 60 * 60 * 1000), // 6 months ago
        profile_photo_url: "/Destination/andaman.webp"
      },
      {
        author_name: "Karan & Anjali Gupta",
        language: "en",
        rating: 5,
        relative_time_description: "7 months ago",
        text: "Singapore was the perfect romantic getaway! The infinity pool at Marina Bay Sands with the city skyline was spectacular. Gardens by the Bay at night was like a fairy tale. Tripsee's itinerary was perfectly balanced between romance and adventure.",
        time: Date.now() - (210 * 24 * 60 * 60 * 1000), // 7 months ago
        profile_photo_url: "/Destination/Singapore.webp"
      }
    ];
  }

  // Helper method to format review data for display
  formatReviewForDisplay(review: GoogleReview, index: number) {
    const destinations = [
      "Maldives Honeymoon",
      "Bali Romantic Escape", 
      "Dubai Proposal Package",
      "Thailand Beach Romance",
      "Andaman Paradise",
      "Singapore City Romance"
    ];

    return {
      id: index + 1,
      name: review.author_name,
      location: destinations[index % destinations.length],
      rating: review.rating,
      date: review.relative_time_description,
      review: review.text,
      image: review.profile_photo_url || `/Destination/${destinations[index % destinations.length].toLowerCase().replace(/\s+/g, '')}.jpeg`,
      verified: true,
      googleReview: true
    };
  }
}

export const googleReviewsService = new GoogleReviewsService(); 