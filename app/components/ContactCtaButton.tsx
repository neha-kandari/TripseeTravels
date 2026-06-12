'use client';

import React from 'react';

/**
 * Small CTA button that opens the global ContactPopup form.
 * Dispatches the `open-contact-popup` custom event which the ContactPopup
 * (mounted once in app/layout.tsx) listens for.
 *
 * Use anywhere you want a button that previously opened WhatsApp directly
 * but should now collect the visitor's details first.
 */
interface Props {
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

const ContactCtaButton: React.FC<Props> = ({ children, className = '', type = 'button' }) => {
  const open = () => {
    try {
      window.dispatchEvent(new CustomEvent('open-contact-popup'));
    } catch {}
  };
  return (
    <button type={type} onClick={open} className={className}>
      {children}
    </button>
  );
};

export default ContactCtaButton;
