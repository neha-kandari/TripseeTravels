'use client';

import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  highlight?: string;
  dayNumber?: number;
}

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
    highlight?: string;
    dayNumber?: number;
  }[];
  allowMultiple?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  children, 
  isOpen = false, 
  onToggle,
  highlight,
  dayNumber 
}) => {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {dayNumber && (
            <div className="flex-shrink-0 bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Day {dayNumber}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-left">{title}</h3>
            {highlight && (
              <span className="text-sm text-gray-600 mt-1 block">
                {highlight}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <ChevronRightIcon className="w-4 h-4 text-gray-600" />
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 bg-white border-t border-gray-200">
          <div className="mt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState<number[]>(allowMultiple ? [] : [0]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openItems.includes(index)}
          onToggle={() => toggleItem(index)}
          highlight={item.highlight}
          dayNumber={item.dayNumber}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion; 