'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ContactPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastClosedTime, setLastClosedTime] = useState<number>(0);
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Show popup every 30 seconds
  useEffect(() => {
    const checkAndShowPopup = () => {
      const now = Date.now();
      const timeSinceLastClosed = now - lastClosedTime;

      // Only show if it's been at least 30 seconds since last closed
      if (timeSinceLastClosed >= 30000) {
        setIsVisible(true);
      }
    };

    // Initial delay of 30 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkAndShowPopup, 30000);

    // Allow any CTA in the app (Book Trip, Start Your Journey, etc.) to
    // open the contact form by dispatching a global custom event. This
    // avoids prop-drilling or a context provider — the popup just listens.
    const openOnDemand = () => setIsVisible(true);
    window.addEventListener('open-contact-popup', openOnDemand);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('open-contact-popup', openOnDemand);
    };
  }, [lastClosedTime]);

  // Don't show popup on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Remove auto-hide functionality - popup stays until user closes it

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      message: ''
    };

    // Name validation - 20 characters max
    if (formData.fullName.length > 20) {
      newErrors.fullName = 'Name must be 20 characters or less';
    }

    // Phone validation - 10 digits
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Apply character limits
    if (name === 'fullName' && value.length <= 20) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'phone') {
      // Only allow digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else if (name !== 'fullName') {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare WhatsApp message with form data
      const whatsappMessage = `Hello! I'm interested in booking a trip with Tripsee.

*Contact Information:*
• Name: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}

*Message:*
${formData.message || 'No additional message'}

Please help me plan my perfect trip!`;

      // Encode the message for WhatsApp URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/918595682910?text=${encodedMessage}`;
      
      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Close popup and reset form
      setIsVisible(false);
      setLastClosedTime(Date.now());
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: ''
      });
      setErrors({
        fullName: '',
        email: '',
        phone: '',
        message: ''
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setLastClosedTime(Date.now());
  };

  const handleLater = () => {
    setIsVisible(false);
    setLastClosedTime(Date.now());
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4">
        {/* Modal */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 relative animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 z-10"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-2 font-limelight">Planning a Trip?</h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2">
                Tell us your preferences and we'll do the rest - it's{' '}
                <span className="font-semibold">fast, free, and personalized!</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Full Name */}
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-3 sm:px-4 py-3 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}

              {/* Email Address */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-3 sm:px-4 py-3 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

              {/* Phone Number Section */}
              <div className="flex gap-2 sm:gap-3">
                <div className="w-16 sm:w-20 flex-shrink-0">
                  <select className="w-full px-2 sm:px-3 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                  </select>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="flex-1 px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}

              {/* Additional Message */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Additional Message"
                rows={3}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3 pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold py-3 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-orange-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Book Now 
                </button>
                <button
                  type="button"
                  onClick={handleLater}
                  className="w-full text-red-500 hover:text-red-600 font-medium py-2 sm:py-2 transition-colors duration-200 text-sm sm:text-base touch-manipulation"
                >
                  I'll do it later
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPopup; 