import React from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Hero from './components/Hero';
import TopDestinations from './components/TopDestinations';
import BaliExploration from './components/BaliExploration';
import MysticCoastline from './components/MysticCoastline';
import PopularPackages from './components/PopularPackages';
import Reveal from './components/Reveal';
import { getHomeContent } from '@/lib/homeContent';

// Mid/deep-fold components — loaded after initial paint to keep first paint fast
const TravelPostcard = dynamic(() => import('./components/TravelPostcard'));
const TravelVibes = dynamic(() => import('./components/TravelVibes'));
const DubaiExploration = dynamic(() => import('./components/DubaiExploration'));
const WhyChooseTripsee = dynamic(() => import('./components/WhyChooseTripsee'));
const PlanYourTrip = dynamic(() => import('./components/PlanYourTrip'));
const Gallery = dynamic(() => import('./components/Gallery'));
const TheyLoveTripsee = dynamic(() => import('./components/TheyLoveTripsee'));
const Footer = dynamic(() => import('./components/Footer'));

export default async function Home() {
  // Fetch once on the server — no client-side fetch needed
  const homeContent = await getHomeContent();

  return (
    <div className="min-h-screen bg-white m-0 p-0 w-full overflow-x-hidden">
      <Header />
      <Hero />
      <Reveal><TopDestinations initialData={homeContent} /></Reveal>
      <Reveal><BaliExploration /></Reveal>
      <Reveal><MysticCoastline /></Reveal>
      <Reveal><PopularPackages initialData={homeContent} /></Reveal>
      <Reveal><TravelPostcard /></Reveal>
      <Reveal><TravelVibes /></Reveal>
      <Reveal><DubaiExploration /></Reveal>
      <Reveal><WhyChooseTripsee /></Reveal>
      <Reveal><PlanYourTrip /></Reveal>
      <Reveal><Gallery /></Reveal>
      <Reveal><TheyLoveTripsee /></Reveal>
      <Footer />
    </div>
  );
}
