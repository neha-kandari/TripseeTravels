'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };

    // Name validation - 20 characters max
    if (formData.name.length > 20) {
      newErrors.name = 'Name must be 20 characters or less';
    }

    // Phone validation - 10 digits
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (formData.phone && phoneDigits.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Apply character limits
    if (name === 'name' && value.length <= 20) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'phone') {
      // Only allow digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare WhatsApp message with form data
    const whatsappMessage = `Hello! I'm interested in your travel services.

*Contact Information:*
â€¢ Name: ${formData.name}
â€¢ Email: ${formData.email}
â€¢ Phone: ${formData.phone || 'Not provided'}

*Message:*
${formData.message}

Please get back to me with more details about your travel packages.`;

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/918595682910?text=${encodedMessage}`;
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setErrors({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-90 pb-16 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className={`text-orange-500 font-lalezar`}> <br /> <br />  GET IN</span>
              <br />
              <span className={"font-limelight"}>TOUCH</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about your next adventure? We&apos;re here to help you plan the perfect getaway. 
              Reach out to us and let&apos;s start planning your dream vacation together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <Reveal>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we&apos;ll redirect you to WhatsApp to continue the conversation and help plan your perfect trip.
                </p>
              </div>



              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="+91 12345 67890"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Tell us about your dream destination, travel dates, group size, or any specific requirements..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redirecting to WhatsApp...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Send Message & Continue on WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map and Contact Info */}
            <div className="space-y-8">
              {/* Map Container */}
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-pink-500 rounded-bl-[3rem] transform rotate-12"></div>
                
                                 {/* Google Maps */}
                 <div className="relative bg-white rounded-xl shadow-lg p-4 mb-6">
                   <div className="w-full h-80 bg-gray-100 rounded-lg relative overflow-hidden">
                     <iframe
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.1234567890123!2d77.32445678901234!3d28.56789012345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3a4c5c5c5c5%3A0x1234567890123456!2sA-100%2C%20Second%20Floor%2C%20Sec-58%2C%20Noida%20-201301!5e0!3m2!1sen!2sin!4v1703567890123!5m2!1sen!2sin"
                       width="100%"
                       height="100%"
                       style={{ border: 0 }}
                       allowFullScreen
                       loading="lazy"
                       referrerPolicy="no-referrer-when-downgrade"
                       className="rounded-lg"
                     />
                   </div>
                   
                   <div className="text-center mt-4">
                     <div className="flex items-center justify-center mb-2">
                       <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                         <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                         </svg>
                       </div>
                       <p className="text-gray-700 font-medium text-sm">Tripsee Travel Agency</p>
                     </div>
                     <p className="text-gray-500 text-xs">A-100, Second Floor, Sec-58, Noida -201301</p>
                     <button 
                       onClick={() => window.open('https://www.google.com/maps/search/A-100,+Second+Floor,+Sec-58,+Noida+-201301', '_blank')}
                       className="mt-3 px-4 py-2 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                     >
                       View Larger Map
                     </button>
                   </div>
                 </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+91-8595682910</p>
                      <p className="text-gray-600">+91-9654145134</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <div className="space-y-1">
                        <a 
                          href="mailto:tripsee.in@gmail.com"
                          className="block text-gray-600 hover:text-pink-600 transition-colors duration-300"
                        >
                          tripsee.in@gmail.com
                        </a>
                        <a 
                          href="mailto:sales@tripseetravel.in"
                          className="block text-gray-600 hover:text-pink-600 transition-colors duration-300"
                        >
                          sales@tripseetravel.in
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp</p>
                      <a 
                        href="https://wa.me/918595682910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        +91 8595682910
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Addresses</p>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <a 
                            href="https://maps.google.com/?q=Jl.+Akasia,+III+No.+19+Denpasar+Bali"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 underline"
                          >
                            <strong>Bali Office:</strong> Jl. Akasia, III No. 19 Denpasar Bali
                          </a>
                        </p>
                        <p className="text-gray-600">
                          <a 
                            href="https://maps.google.com/?q=A-100,+Second+Floor,+Sec-58,+Noida+-201301"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 underline"
                          >
                            <strong>Noida Office:</strong> A-100, Second Floor, Sec-58, Noida -201301
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium text-gray-900">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-gray-900">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-gray-900">11:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* FAQ Section */}
      <Reveal>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our travel services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How far in advance should I book my trip?",
                answer: "We recommend booking at least 2-3 months in advance for international trips and 1 month for domestic travel to get the best deals and availability."
              },
              {
                question: "Do you offer travel insurance?",
                answer: "Yes, we provide comprehensive travel insurance options to protect your trip investment and give you peace of mind while traveling."
              },
              {
                question: "Can I customize my travel package?",
                answer: "Absolutely! All our packages are fully customizable. We work with you to create the perfect itinerary based on your preferences and budget."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, bank transfers, and offer flexible payment plans. A small deposit secures your booking."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* CTA Section */}
      <Reveal>
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Don&apos;t wait any longer. Contact us today and let&apos;s turn your travel dreams into reality!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/918595682910"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              WhatsApp Us Now
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-colors">
              Browse Packages
            </button>
          </div>
        </div>
      </section>
      </Reveal>

      <Footer />
    </div>
  );
};

export default ContactPage; 
