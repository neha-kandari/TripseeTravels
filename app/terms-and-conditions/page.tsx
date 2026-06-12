'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-50 to-pink-50">
        <br /><br /> <br /> <br /> <br /> <br />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className={`text-orange-500 font-lalezar`}>TERMS &</span>
              <br />
              <span className={"font-limelight"}>CONDITIONS</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Please read these terms and conditions carefully before booking your travel with Tripsee Travels
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <Reveal>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Visa Requirements */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                VISA REQUIREMENTS
              </h2>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6">
                <p className="text-orange-800 font-semibold mb-2">Important Notice:</p>
                <p className="text-gray-700">
                  Please ensure your Passport Validity is minimum 06 months from the date of travel – Required to travel anywhere outside India. 
                  06 months validity should be calculated from your expected return date from your selected Foreign destination. 
                  <strong className="text-red-600"> DO NOT PROCEED WITH BOOKING IN ABSENCE OF 6 MONTHS VALIDITY.</strong>
                </p>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Clients will have to abide by any changes in visa regulations (Visa fees, processing time, visa rejection for any reason) done by Government, Consulates or Visa Processing Agencies. Tripsee Travels will not be held responsible for the same and guests must bear full cost of such changes.
                </p>
              </div>
            </div>

            {/* General Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                TERMS AND CONDITIONS
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Check in time is 1400 Hrs and Checkout Timing of the hotel will be 12 noon. Above rates are calculated on the basis of hotels mentioned in the itinerary. In case if any of the above quoted hotels are fully booked then we will change the hotels or tour plan without your permission and consent and try for the next best similar hotel available. We have our own professional mechanism to check the quality of hotels in each category. Even though we suggest you check websites, reviews, features & location of hotels mentioned to make sure it is as per your expectations before confirming.
                    </p>
                    <p>
                      During the journey if someone asks for extra money for any of the services included in the package, you may inform us and we will not be responsible if you pay the amount without our permission. The Picture shown above can be different from actual. Any activity and entrance ticket if not mentioned in inclusions then it will be considered as exclusion and guests have to pay it by their own while traveling to the particular places.
                    </p>
                    <p>
                      For extra persons, if included in the tour cost, we will be providing Extra Bed/Mattresses/Rollover bed only. Service charges of Rs. 10,000/- per person for creating and customizing the itinerary. After receiving the confirmation of payment at that time till the hotel is not booked and if prices fluctuate then the traveler has to bear the amount of fluctuation.
                    </p>
                    <p>
                      Tripsee Travels is not responsible or liable for any kind of cancellation, modification or rescheduling occurs in holiday packages due to cancellation on or rescheduling of airlines, climate factor, natural disaster, political disturbances, strikes or riots or government decision or any other reasons. All complimentary services provided in the itinerary are subject to availability and are not claimable either in kind or in cash. Late payment fees Rs. 2000/- per person per day will be applicable from the due date.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Charges */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                SERVICE CHARGES
              </h2>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    Tripsee Travels offers comprehensive travel solutions. When clients opt for our full package services and subsequently choose independent flight bookings, they understand that our services and expertise, which include a non-refundable service charge of ₹10,000 per person, are integral to the customized travel experience we provide. In the event of cancellations, Tripsee Travels reserves the right to take necessary steps, including flight ticket cancellations, to recover costs associated with our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Policies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                TRAVEL POLICIES
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Tripsee Travels holds the right to change the Airline, Travel Date (any point of time before the departure of the Tour; alternate options will be advised in case this happens). Tripsee Travels holds the right to change the Hotel (any point of time before the departure of the Tour, alternate options of same category will be booked and advised in case this happens).
                    </p>
                    <p>
                      The third person sharing the room to be provided with an additional mattress or a rollaway bed. Hotel standard check-in time 1400 hours, early check-in will be subject to availability. Check-out time at the hotel is 1200 hours (If your flight is in the evening, we request you to deposit your luggage at the hotel Lobby and leave your room before the check-out time).
                    </p>
                    <p>
                      The travel tour components mentioned here are subject to change at last minute variation that may occur due to factors beyond control of the Tripsee Travels. Child with age 12 or above will be considered as adult. The cost is based on current government and airline taxes and any increase in the same in future will be collected as per actual. Above-given rates are valid only for Indian nationals.
                    </p>
                    <p>
                      Itinerary is subject to change without any prior notice. If the itinerary gets changed on the ground, then travelers have to follow the itinerary received by them on the ground.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Insurance & Safety */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                TRAVEL INSURANCE & SAFETY
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Travel insurance is strictly advised during travel. In case of any casualty during the trip due to any reason, Tripsee Travels is not responsible or liable for any kind of claims. Entry fees to monuments, sanctuaries, museums, activities, etc. have not been included in the package.
                    </p>
                    <p>
                      The above day-wise itinerary is only a suggested plan as the car is on a disposal basis. Also, note that video & audio systems are prohibited in commercial vehicles as per law and we do not guarantee those facilities. We do not accept any amendment or cancellation for running packages. Please reach the airport 3 hours before the departure of the flight. In some airlines, food and beverages are on a chargeable basis. Kindly reconfirm the departure terminal and the flight schedule from the airline before leaving for the airport. Web check-in is not possible in our packages. Transfers and sightseeing tours are as per the itinerary given.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                ADDITIONAL TERMS
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The request for an adjacent or adjoining room will be subject to availability. It is mandatory to carry the age proof of children (02 to 11 yrs) and infants (below 02 yrs) along with other travel documents. Children above 11 yrs shall be considered for an adult cost. Airfare is subject to availability, if included and can be increased at the time of final confirmation. In airlines, no seat is provided to an infant. Room allocation (Twin bed / Double bed) is at the discretion of the hotel at the time of check-in.
                    </p>
                    <p>
                      The number of meals is always corresponding to the number of nights booked. Breakfast is not provided on the day of arrival. No one has the right to interpret/assume the package services and inclusions mentioned in the quotation. Being a final service provider, only Tripsee Travels reserves the sole right to interpret the language of services mentioned in the inclusions/quotation which cannot be challenged by anyone on legal grounds.
                    </p>
                    <p>
                      For early check-in and late check-out, the payment is to be settled directly by the guest. The hotel has the right to claim the damages incurred by any of the guests. The guests are requested to take care of their personal belongings carefully and avoid leaving them unattended. Proper swim wear is necessary to avail the swimming pool facility.
                    </p>
                    <p>
                      There will be no change in product after getting the package confirmed and if required then it will be charged Rs. 5000/- per customization. Final itinerary may change from the quoted itinerary but the inclusions will remain the same. Cost of additional services availed by the guest which are not part of our package inclusions are to be settled directly at the hotel. Mini bar facility available in the hotels is on chargeable basis. Buffet meals if included will be provided at a fixed venue decided by the hotel. Timings: Breakfast: 0800-1000 hrs; Lunch: 1300-1500 hrs; Dinner: 1930-2200 hrs but it varies from hotel to hotel as well. These are the standard buffet timings observed by the hotels. Still, you are kindly requested to check the perfect buffet timings at the time of check-in at the hotel. Once the buffet time is over, the hotel might ask you to pay for your meals.
                    </p>
                    <p>
                      This hotel is suggested on the basis of the feedback taken from our customers. Still, we request you that before finalizing the tour with us, kindly go through the website of the hotels and read the reviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TCS Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                TAX INFORMATION
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <p className="text-gray-700">
                  TCS is charged as per the government guidelines on International Holiday packages.
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                CANCELLATION POLICY
              </h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
                <p className="text-red-800 font-semibold mb-2">Important:</p>
                <p className="text-gray-700">Airlines tickets once issued are Non-Refundable. With immediate effect, if a traveler wants to cancel the trip, then Tripsee Travels will charge Rs. 5,000/- Per Person as consultation/service charges. Booking amount is 100% non refundable.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Land Part Cancellation Policy:</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If cancellation is made 45 days prior to departure, 20% of the tour cost shall be deducted. If cancellation is made 30 days prior to departure, 40% of the tour cost shall be deducted. If cancellation is made 30 to 14 days prior to departure, 70% of the tour cost shall be deducted. If cancellation is made 14 to 00 days prior to departure, 100% of the tour cost shall be deducted. In case the passenger is a No Show at the time of Departure, 100% of the tour cost shall be deducted.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>NOTE:</strong> Above cancellation charges are dynamic and can change depending upon our vendors and on ground suppliers.
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
      </Reveal>

      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
