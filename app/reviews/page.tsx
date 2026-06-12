'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

const ReviewsPage = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoErrors, setVideoErrors] = useState<{[key: string]: boolean}>({});
  const [useFallback, setUseFallback] = useState<{[key: string]: boolean}>({});

  // Google Reviews data
  const googleReviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Google Review",
      rating: 5,
      date: "2 weeks ago",
      review: "Exceptional service! Tripsee Travels made our Bali honeymoon absolutely perfect. From the moment we contacted them until we returned home, everything was flawlessly organized. The private pool villa they arranged was beyond our dreams. Highly recommend!",
      image: "/assets/gallery/IMG_1.webp",
      source: "Google",
      verified: true
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Google Review", 
      rating: 5,
      date: "1 month ago",
      review: "Outstanding travel agency! We booked our Dubai trip through Tripsee and couldn't be happier. The Burj Khalifa proposal setup was magical, and the photographer they arranged captured every perfect moment. Professional, reliable, and truly cares about their customers.",
      image: "/assets/gallery/IMG_2.webp",
      source: "Google",
      verified: true
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Google Review",
      rating: 5,
      date: "3 weeks ago", 
      review: "Tripsee Travels exceeded all expectations! Our Thailand beach vacation was perfectly planned. The resort selection was spot-on, and the sunset cruise was the highlight of our trip. Their local guides were knowledgeable and friendly. Will definitely book again!",
      image: "/assets/gallery/IMG_3.webp",
      source: "Google",
      verified: true
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Google Review",
      rating: 5,
      date: "1 week ago",
      review: "Amazing experience with Tripsee! Our Andaman Islands trip was unforgettable. The crystal-clear waters at Radhanagar Beach and the candlelit dinner under the stars were magical. Their attention to detail and customer service is top-notch. Highly recommended!",
      image: "/assets/gallery/IMG_4.webp",
      source: "Google",
      verified: true
    },
    {
      id: 5,
      name: "Meera Gupta",
      location: "Google Review",
      rating: 5,
      date: "2 weeks ago",
      review: "Best travel agency we've ever used! Our Singapore city romance package was perfectly executed. The Marina Bay Sands infinity pool experience and Gardens by the Bay at night were incredible. Tripsee's team is professional, responsive, and truly cares about creating memorable experiences.",
      image: "/assets/gallery/IMG_5.webp",
      source: "Google",
      verified: true
    },
    {
      id: 6,
      name: "Arjun Reddy",
      location: "Google Review",
      rating: 5,
      date: "3 days ago",
      review: "Outstanding service from start to finish! Our Maldives honeymoon was absolutely perfect thanks to Tripsee Travels. The overwater villa was stunning, and every detail was carefully planned. Their customer support is excellent, and they truly understand what makes a trip special.",
      image: "/assets/gallery/IMG_1.webp",
      source: "Google",
      verified: true
    }
  ];

  // Customer reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah & Michael Johnson",
      location: "Maldives Honeymoon",
      rating: 5,
      date: "December 2023",
      review: "Our honeymoon in Maldives was absolutely magical! The overwater villa was stunning, and the candlelit dinner on the beach was unforgettable. Tripsee made everything perfect from start to finish. The attention to detail and personalized service exceeded all our expectations.",
      image: "/assets/gallery/IMG_1.webp"
    },
    {
      id: 2,
      name: "Priya & Arjun Sharma",
      location: "Bali Romantic Escape",
      rating: 5,
      date: "November 2023",
      review: "Bali was a dream come true! The private pool villa in Ubud was surrounded by lush rice terraces. The floating breakfast and couple's spa treatments were highlights. Tripsee's local guides showed us hidden gems we never would have found on our own.",
      image: "/assets/gallery/IMG_2.webp"
    },
    {
      id: 3,
      name: "David & Emma Wilson",
      location: "Dubai Proposal Package",
      rating: 5,
      date: "October 2023",
      review: "The proposal setup at Burj Khalifa was beyond our wildest dreams! Emma said YES with the most incredible backdrop. The professional photography captured every emotion perfectly. Thank you Tripsee for making this the most important moment of our lives so special.",
      image: "/assets/gallery/IMG_3.webp"
    },
    {
      id: 4,
      name: "Ravi & Meera Patel",
      location: "Thailand Beach Romance",
      rating: 5,
      date: "September 2023",
      review: "Thailand exceeded every expectation! The islands were pristine, the food was incredible, and the sunset cruise was magical. Our resort in Phuket was perfect, and the staff treated us like royalty. Tripsee planned every detail flawlessly.",
      image: "/assets/gallery/IMG_4.webp"
    },
    {
      id: 5,
      name: "Alex & Lisa Rodriguez",
      location: "Andaman Paradise",
      rating: 5,
      date: "August 2023",
      review: "Andaman Islands were absolutely breathtaking! The crystal-clear waters at Radhanagar Beach and the snorkeling at Elephant Beach were incredible. The candlelit dinner under the stars was the most romantic evening of our lives. Highly recommend Tripsee!",
      image: "/assets/gallery/IMG_5.webp"
    },
    {
      id: 6,
      name: "Karan & Anjali Gupta",
      location: "Singapore City Romance",
      rating: 5,
      date: "July 2023",
      review: "Singapore was the perfect romantic getaway! The infinity pool at Marina Bay Sands with the city skyline was spectacular. Gardens by the Bay at night was like a fairy tale. Tripsee's itinerary was perfectly balanced between romance and adventure.",
      image: "/assets/gallery/IMG_1.webp"
    }
  ];

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    currentReviewIndex * reviewsPerPage,
    (currentReviewIndex + 1) * reviewsPerPage
  );

  const nextReviews = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % totalPages);
  };

  const prevReviews = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Video data — all served from Cloudinary (q_auto,f_auto = auto-compress + best format)
  // poster = so_0 (seek to frame 0) so the card shows an image instantly while the video loads
  const videoReviews = [
    {
      id: 1,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762082014/Feedback/Feedback/WhatsApp%20Video%202024-02-21%20at%2016.23.19_fd0537da.mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762082014/Feedback/Feedback/WhatsApp%20Video%202024-02-21%20at%2016.23.19_fd0537da.jpg',
      fallback: '/Feedback/WhatsApp%20Video%202024-02-21%20at%2016.23.19_fd0537da.mp4',
      name: "Ms. Poonam & Mr. Pankaj",
      location: "Bali",
      description: "Amazing honeymoon experience!"
    },
    {
      id: 2,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762082060/Feedback/Feedback/WhatsApp%20Video%202024-12-23%20at%206.27.27%20PM.mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762082060/Feedback/Feedback/WhatsApp%20Video%202024-12-23%20at%206.27.27%20PM.jpg',
      fallback: '/Feedback/WhatsApp%20Video%202024-12-23%20at%206.27.27%20PM.mp4',
      name: "Ms. Yashika & Mr. Ankush",
      location: "Maldives",
      description: "Perfect romantic getaway!"
    },
    {
      id: 3,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762081962/Feedback/Feedback/WhatsApp%20Video%202024-01-11%20at%2017.30.52.mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762081962/Feedback/Feedback/WhatsApp%20Video%202024-01-11%20at%2017.30.52.jpg',
      fallback: '/Feedback/WhatsApp%20Video%202024-01-11%20at%2017.30.52.mp4',
      name: "Mr. Vaibhav & Mrs. Kashish",
      location: "Dubai",
      description: "Proposal was magical!"
    },
    {
      id: 4,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/v1762082108/Feedback/Feedback/WhatsApp%20Video%202025-07-21%20at%204.08.19%20PM.mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/v1762082108/Feedback/Feedback/WhatsApp%20Video%202025-07-21%20at%204.08.19%20PM.jpg',
      fallback: '/Feedback/WhatsApp%20Video%202025-07-21%20at%204.08.19%20PM.mp4',
      name: "Ms. Pallavi and Mr. Ankit",
      location: "Thailand",
      description: "Unforgettable adventure!"
    },
    {
      id: 5,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-06-30%20at%202.51.20%20PM%20(1).mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-06-30%20at%202.51.20%20PM%20(1).jpg',
      fallback: '/Feedback/WhatsApp%20Video%202024-06-30%20at%202.51.20%20PM%20(1).mp4',
      name: "Mr. Pranabh",
      location: "Bali",
      description: "Crystal clear waters!"
    },
    {
      id: 6,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-04-24%20at%2020.06.07_e81e8432.mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-04-24%20at%2020.06.07_e81e8432.jpg',
      fallback: '/Feedback/WhatsApp%20Video%202024-04-24%20at%2020.06.07_e81e8432.mp4',
      name: "Mr. Vikas",
      location: "Bali",
      description: "City romance at its best!"
    },
    {
      id: 7,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-06-10%20at%2012.44.27_c8380109.mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-06-10%20at%2012.44.27_c8380109.jpg',
      fallback: '/Feedback/WhatsApp%20Video%202024-06-10%20at%2012.44.27_c8380109.mp4',
      name: "Kakkars",
      location: "Malaysia",
      description: "Cultural immersion!"
    },
    {
      id: 8,
      video:  'https://res.cloudinary.com/dpknmji5i/video/upload/q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-05-07%20at%2017.06.28_77a16445.mp4',
      poster: 'https://res.cloudinary.com/dpknmji5i/video/upload/so_0,q_auto,f_auto/Feedback/Feedback/WhatsApp%20Video%202024-05-07%20at%2017.06.28_77a16445.jpg',
      fallback: '/Feedback/WhatsApp%20Video%202024-05-07%20at%2017.06.28_77a16445.mp4',
      name: "Mr. Rakesh & FAM",
      location: "Vietnam",
      description: "Adventure of a lifetime!"
    }
  ];

  const nextVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => {
      const newIndex = (prev + 1) % videoReviews.length;
      console.log('Next video:', newIndex, videoReviews[newIndex].name);
      return newIndex;
    });
  }, [videoReviews]);

  const prevVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => {
      const newIndex = (prev - 1 + videoReviews.length) % videoReviews.length;
      console.log('Previous video:', newIndex, videoReviews[newIndex].name);
      return newIndex;
    });
  }, [videoReviews]);

  const getCurrentVideos = () => {
    const current = videoReviews[currentVideoIndex];
    const prev = videoReviews[(currentVideoIndex - 1 + videoReviews.length) % videoReviews.length];
    const next = videoReviews[(currentVideoIndex + 1) % videoReviews.length];
    return { prev, current, next };
  };

  const { prev: prevVideoData, current: currentVideoData, next: nextVideoData } = getCurrentVideos();

  const toggleMute = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  const handleVideoError = (videoKey: string, videoId: number) => {
    console.warn(`Video failed to load: ${videoKey}`);
    const review = videoReviews.find(r => r.id === videoId);
    if (review && review.fallback && !useFallback[videoKey]) {
      setUseFallback(prev => ({ ...prev, [videoKey]: true }));
    } else {
      setVideoErrors(prev => ({ ...prev, [videoKey]: true }));
    }
  };

  const isDev = process.env.NODE_ENV === 'development';

  const getSrc = (videoKey: string, videoData: typeof videoReviews[0]) => {
    return isDev
      ? (videoData.fallback || videoData.video)
      : (useFallback[videoKey] ? videoData.fallback : videoData.video);
  };

  const getPoster = (videoData: typeof videoReviews[0]) => {
    return isDev ? undefined : videoData.poster;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevVideo();
      } else if (event.key === 'ArrowRight') {
        nextVideo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [nextVideo, prevVideo]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Gallery Layout */}
      <section className="relative h-screen bg-gray-50 overflow-hidden pt-32">
        <br /><br /><br />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Desktop Layout - Side by Side */}
          <div className="hidden lg:flex items-center justify-center h-full gap-8">
            
            {/* Left Side - Large Image */}
            <div className="w-1/2 h-5/6">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/gallery/IMG_1.webp"
                  alt="Dubai romantic destination"
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Dubai Romance</h3>
                  <p className="text-white/90">Luxury at its finest</p>
                </div>
              </div>
            </div>

            {/* Right Side - Four Equal Small Images */}
            <div className="w-1/2 h-5/6">
              <div className="grid grid-cols-2 gap-4 h-full">
                
                {/* Top Left */}
                <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                  <Image
                    src="/assets/gallery/IMG_2.webp"
                    alt="Beach romance destination"
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="text-lg font-semibold">Beach Paradise</h4>
                    <p className="text-xs text-white/80">Tropical bliss</p>
                  </div>
                </div>

                {/* Top Right */}
                <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                  <Image
                    src="/assets/gallery/IMG_3.webp"
                    alt="Cultural heritage destination"
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="text-lg font-semibold">Cultural Heritage</h4>
                    <p className="text-xs text-white/80">Ancient wonders</p>
                  </div>
                </div>

                {/* Bottom Left */}
                <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                  <Image
                    src="/assets/gallery/IMG_4.webp"
                    alt="Mountain landscape destination"
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="text-lg font-semibold">Mountain Escape</h4>
                    <p className="text-xs text-white/80">Serene valleys</p>
                  </div>
                </div>

                {/* Bottom Right */}
                <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                  <Image
                    src="/assets/gallery/IMG_5.webp"
                    alt="Island paradise destination"
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="text-lg font-semibold">Island Paradise</h4>
                    <p className="text-xs text-white/80">Crystal waters</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden flex flex-col h-full">
            {/* Hero Content - Mobile First */}
            <div className="text-center text-gray-900 bg-white/40 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                <span className={`text-orange-500 font-lalezar`}>CUSTOMER</span>
                <br />
                <span className={"font-limelight"}>REVIEWS</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Discover what our travelers say about their incredible journeys with us
              </p>
              <div className="flex items-center justify-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="text-sm sm:text-base">⭐</span>
                ))}
                <span className="text-gray-700 ml-2 font-semibold text-xs sm:text-sm">4.9/5 from 1000+ reviews</span>
              </div>
            </div>

            {/* Mobile Gallery Grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* Large Image - Top Left */}
              <div className="col-span-2 relative rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/assets/gallery/IMG_1.webp"
                  alt="Dubai romantic destination"
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-lg font-bold mb-1">Dubai Romance</h3>
                  <p className="text-xs text-white/90">Luxury at its finest</p>
                </div>
              </div>

              {/* Small Images Grid */}
              <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                <Image
                  src="/assets/gallery/IMG_2.webp"
                  alt="Beach romance destination"
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm font-semibold">Beach Paradise</h4>
                  <p className="text-xs text-white/80">Tropical bliss</p>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                <Image
                  src="/assets/gallery/IMG_3.webp"
                  alt="Cultural heritage destination"
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm font-semibold">Cultural Heritage</h4>
                  <p className="text-xs text-white/80">Ancient wonders</p>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                <Image
                  src="/assets/gallery/IMG_4.webp"
                  alt="Mountain landscape destination"
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm font-semibold">Mountain Escape</h4>
                  <p className="text-xs text-white/80">Serene valleys</p>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                <Image
                  src="/assets/gallery/IMG_5.webp"
                  alt="Island paradise destination"
                  fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h4 className="text-sm font-semibold">Island Paradise</h4>
                  <p className="text-xs text-white/80">Crystal waters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Hero Content Overlay */}
          <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none pt-16">
            <div className="text-center text-gray-900 bg-white/40 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                <span className={`text-orange-500 font-lalezar`}>CUSTOMER</span>
                <br />
                <span className={"font-limelight"}>REVIEWS</span>
              </h1>
              <p className="text-lg text-gray-600 mb-4 max-w-xl">
                Discover what our travelers say about their incredible journeys with us
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="text-xl">⭐</span>
                ))}
                <span className="text-gray-700 ml-2 font-semibold text-sm">4.9/5 from 1000+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Reviews Slider Section */}
      <Reveal>
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Watch Our <span className="text-orange-500">Happy Travelers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real video testimonials from our customers sharing their amazing travel experiences
            </p>
          </div>

                     {/* Video Slider */}
           <div className="relative">
             {/* Desktop Layout - Three Videos */}
             <div className="hidden lg:flex justify-center items-center gap-6 overflow-hidden">
               {/* Left Video */}
               <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-lg opacity-70 scale-90 transition-all duration-500 relative">
                 {videoErrors[`prev-${currentVideoIndex}`] ? (
                   <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                     <div className="text-center text-gray-500">
                       <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                       </svg>
                       <p className="text-sm">Video unavailable</p>
                     </div>
                   </div>
                 ) : (
                    <video
                      key={`prev-${currentVideoIndex}`}
                      className="w-full h-full object-cover"
                      src={getSrc(`prev-${currentVideoIndex}`, prevVideoData)}
                      poster={getPoster(prevVideoData)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      onError={() => handleVideoError(`prev-${currentVideoIndex}`, prevVideoData.id)}
                      onCanPlay={(e) => {
                        e.currentTarget.play().catch(err => console.log('Autoplay error:', err));
                      }}
                    />
                 )}
                 <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
                   {prevVideoData.name} - {prevVideoData.location}
                 </div>
               </div>

               {/* Center Video (Main) */}
               <div className="w-96 h-[28rem] rounded-2xl overflow-hidden shadow-2xl relative transform scale-100 transition-all duration-500">
                 {videoErrors[`current-${currentVideoIndex}`] ? (
                   <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                     <div className="text-center text-gray-500">
                       <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                       </svg>
                       <p className="text-lg font-medium">Video unavailable</p>
                       <p className="text-sm">Please check your connection</p>
                     </div>
                   </div>
                 ) : (
                    <video
                      key={`current-${currentVideoIndex}`}
                      className="w-full h-full object-cover"
                      src={getSrc(`current-${currentVideoIndex}`, currentVideoData)}
                      poster={getPoster(currentVideoData)}
                      autoPlay
                      loop
                      muted={isVideoMuted}
                      playsInline
                      preload="auto"
                      onError={() => handleVideoError(`current-${currentVideoIndex}`, currentVideoData.id)}
                      onCanPlay={(e) => {
                        e.currentTarget.play().catch(err => console.log('Autoplay error:', err));
                      }}
                    />
                 )}
                 <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-lg">
                   <h4 className="font-semibold">{currentVideoData.name} - {currentVideoData.location}</h4>
                   <p className="text-sm text-gray-200">{currentVideoData.description}</p>
                 </div>
                 
                 {/* Play/Pause Button */}
                 <div className="absolute top-4 right-4">
                   <button className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M8 5v14l11-7z"/>
                     </svg>
                   </button>
                 </div>

                 {/* Mute/Unmute Button */}
                 <div className="absolute top-4 left-4">
                   <button 
                     onClick={toggleMute}
                     className="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                   >
                     {isVideoMuted ? (
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                       </svg>
                     ) : (
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                       </svg>
                     )}
                   </button>
                 </div>
               </div>

               {/* Right Video */}
               <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-lg opacity-70 scale-90 transition-all duration-500 relative">
                 {videoErrors[`next-${currentVideoIndex}`] ? (
                   <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                     <div className="text-center text-gray-500">
                       <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                       </svg>
                       <p className="text-sm">Video unavailable</p>
                     </div>
                   </div>
                 ) : (
                    <video
                      key={`next-${currentVideoIndex}`}
                      className="w-full h-full object-cover"
                      src={getSrc(`next-${currentVideoIndex}`, nextVideoData)}
                      poster={getPoster(nextVideoData)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      onError={() => handleVideoError(`next-${currentVideoIndex}`, nextVideoData.id)}
                      onCanPlay={(e) => {
                        e.currentTarget.play().catch(err => console.log('Autoplay error:', err));
                      }}
                    />
                 )}
                 <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
                   {nextVideoData.name} - {nextVideoData.location}
                 </div>
               </div>
             </div>

             {/* Mobile Layout - Single Video */}
             <div className="lg:hidden flex justify-center">
               <div className="w-full max-w-sm h-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl relative">
                 {videoErrors[`current-${currentVideoIndex}`] ? (
                   <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                     <div className="text-center text-gray-500">
                       <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                       </svg>
                       <p className="text-lg font-medium">Video unavailable</p>
                       <p className="text-sm">Please check your connection</p>
                     </div>
                   </div>
                 ) : (
                    <video
                      key={`current-${currentVideoIndex}`}
                      className="w-full h-full object-cover"
                      src={getSrc(`current-${currentVideoIndex}`, currentVideoData)}
                      poster={getPoster(currentVideoData)}
                      autoPlay
                      loop
                      muted={isVideoMuted}
                      playsInline
                      preload="auto"
                      onError={() => handleVideoError(`current-${currentVideoIndex}`, currentVideoData.id)}
                      onCanPlay={(e) => {
                        e.currentTarget.play().catch(err => console.log('Autoplay error:', err));
                      }}
                    />
                 )}
                 <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                   <h4 className="font-semibold text-sm sm:text-base">{currentVideoData.name} - {currentVideoData.location}</h4>
                   <p className="text-xs sm:text-sm text-gray-200">{currentVideoData.description}</p>
                 </div>
                 
                 {/* Play/Pause Button - Mobile */}
                 <div className="absolute top-3 right-3">
                   <button className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg">
                     <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M8 5v14l11-7z"/>
                     </svg>
                   </button>
                 </div>

                 {/* Mute/Unmute Button - Mobile */}
                 <div className="absolute top-3 left-3">
                   <button 
                     onClick={toggleMute}
                     className="w-8 h-8 sm:w-10 sm:h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                   >
                     {isVideoMuted ? (
                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                       </svg>
                     ) : (
                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                       </svg>
                     )}
                   </button>
                 </div>
               </div>
             </div>

             {/* Navigation Buttons - Desktop */}
             <button 
               onClick={prevVideo}
               className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-orange-500 text-white rounded-full items-center justify-center hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
             </button>

             <button 
               onClick={nextVideo}
               className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-orange-500 text-white rounded-full items-center justify-center hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
             </button>

             {/* Navigation Buttons - Mobile */}
             <button 
               onClick={prevVideo}
               className="lg:hidden absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
             >
               <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
             </button>

             <button 
               onClick={nextVideo}
               className="lg:hidden absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
             >
               <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
             </button>
           </div>

           {/* Video Indicators */}
           <div className="flex justify-center mt-8 gap-3">
             {videoReviews.map((_, index) => (
               <div
                 key={index}
                 onClick={() => setCurrentVideoIndex(index)}
                 className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                   index === currentVideoIndex
                     ? 'bg-orange-500 scale-125'
                     : 'bg-gray-300 hover:bg-orange-300'
                 }`}
               />
             ))}
           </div>

          
        </div>
      </section>
      </Reveal>

      {/* Google Reviews Section */}
      <Reveal>
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h2 className="text-4xl font-bold text-gray-900">
                Google <span className="text-blue-500">Reviews</span>
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              See what our customers are saying about us on Google
            </p>
            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
              <span className="text-gray-700 ml-3 font-semibold text-lg">4.9/5 from 150+ Google reviews</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Google Verified
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Trusted Reviews
              </span>
            </div>
          </div>

          {/* Google Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {googleReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <Image
                        src={review.image}
                        alt={review.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{review.date}</span>
                        {review.verified && (
                          <span className="flex items-center text-xs text-green-600 font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">{review.source}</span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">⭐</span>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  &ldquo;{review.review}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Google Review
                  </span>
                  <span className="text-xs text-gray-500">
                    {review.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View More Reviews Button */}
          <div className="text-center">
            <a 
              href="https://www.google.com/search?q=Tripsee+Travels+reviews" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.62z" fill="white"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
              </svg>
              View All Google Reviews
            </a>
          </div>
        </div>
      </section>
      </Reveal>


      {/* Stats Section */}
      <Reveal>
      <section className="py-16 bg-gradient-to-r from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-500 mb-2">1000+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-500 mb-2">4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-500 mb-2">150+</div>
              <div className="text-gray-600">Google Reviews</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-500 mb-2">100%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Call to Action */}
      <Reveal>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Create Your Own <span className="text-orange-500">Amazing Story?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers and let us plan your perfect getaway
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Start Planning Your Trip
          </button>
        </div>
      </section>
      </Reveal>

      <Footer />
    </div>
  );
};

export default ReviewsPage; 