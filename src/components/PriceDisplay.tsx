import React from 'react';

interface PriceDisplayProps {
  price: number;
  currency?: 'AFN' | 'USD';
  className?: string;
  showCurrency?: boolean;
}

export default function PriceDisplay({ 
  price, 
  currency = 'AFN', 
  className = 'text-lg font-bold',
  showCurrency = true 
}: PriceDisplayProps) {
  // Format the number
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  if (currency === 'USD') {
    // USD - $ işareti sağda, küçük
    return (
      <span className={`${className} inline-flex items-baseline gap-1`} dir="ltr">
        <span>{formattedNumber}</span>
        {showCurrency && <span className="text-[0.65em] opacity-70 font-normal">$</span>}
      </span>
    );
  }

  // AFN - افغانی SOLDA (RTL için doğal)
  return (
    <span className={`${className} inline-flex items-baseline gap-1`} dir="rtl">
      {showCurrency && <span className="text-[0.65em] opacity-70 font-normal">افغانی</span>}
      <span>{formattedNumber}</span>
    </span>
  );
}
