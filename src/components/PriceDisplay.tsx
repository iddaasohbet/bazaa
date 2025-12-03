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
    return (
      <span className={className}>
        <span className="text-xs opacity-70">$</span>
        {formattedNumber.replace('$', '')}
      </span>
    );
  }

  // AFN - rakam büyük, AFN küçük ve sağda
  return (
    <span className={`${className} inline-flex items-baseline gap-1`} dir="ltr">
      <span>{formattedNumber}</span>
      {showCurrency && <span className="text-[0.65em] opacity-70 font-normal">AFN</span>}
    </span>
  );
}
