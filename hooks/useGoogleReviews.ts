import { useState, useEffect } from 'react';
import { googleReviewsService, GoogleReview } from '../lib/googleReviews';

export interface FormattedReview {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  image: string;
  verified: boolean;
  googleReview: boolean;
}

export interface PlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
  formatted_address?: string;
  website?: string;
}

export const useGoogleReviews = () => {
  const [reviews, setReviews] = useState<FormattedReview[]>([]);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails>({
    name: 'Tripsee',
    rating: 4.9,
    user_ratings_total: 1000
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both reviews and place details in parallel
        const [googleReviews, details] = await Promise.all([
          googleReviewsService.getPlaceReviews(),
          googleReviewsService.getPlaceDetails()
        ]);

        // Format reviews for display
        const formattedReviews = googleReviews.map((review, index) =>
          googleReviewsService.formatReviewForDisplay(review, index)
        );

        setReviews(formattedReviews);
        setPlaceDetails({
          name: details.name || 'Tripsee',
          rating: details.rating || 4.9,
          user_ratings_total: details.user_ratings_total || 1000,
          formatted_address: details.formatted_address,
          website: details.website
        });
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
        
        // Set fallback data
        const fallbackReviews = googleReviewsService.getFallbackReviews();
        const formattedFallbackReviews = fallbackReviews.map((review, index) =>
          googleReviewsService.formatReviewForDisplay(review, index)
        );
        setReviews(formattedFallbackReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const refreshReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const googleReviews = await googleReviewsService.getPlaceReviews();
      const formattedReviews = googleReviews.map((review, index) =>
        googleReviewsService.formatReviewForDisplay(review, index)
      );

      setReviews(formattedReviews);
    } catch (err) {
      console.error('Error refreshing reviews:', err);
      setError('Failed to refresh reviews.');
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    placeDetails,
    loading,
    error,
    refreshReviews
  };
}; 