
export const formatCurrency = (
    value: number | string | any,
    decimals: number = 1,
    currency: string = "$"
  ): string => {
    // Handle null, undefined or empty strings
    if (value === null || value === undefined || value === "") {
      return `${currency}0`;
    }
  
    // Convert to number
    const num = typeof value === "string" ? parseFloat(value) : Number(value);
  
    // Handle NaN
    if (isNaN(num)) {
      return `${currency}0`;
    }
  
    // Format based on magnitude
    if (Math.abs(num) >= 1_000_000_000) {
      // Billions
      return `${currency}${(num / 1_000_000_000).toFixed(decimals)}B`;
    } else if (Math.abs(num) >= 1_000_000) {
      // Millions
      return `${currency}${(num / 1_000_000).toFixed(decimals)}M`;
    } else if (Math.abs(num) >= 1_000) {
      // Thousands
      return `${currency}${(num / 1_000).toFixed(decimals)}K`;
    } else {
      // Less than 1000
      return `${currency}${num.toFixed(decimals)}`;
    }
  };
  