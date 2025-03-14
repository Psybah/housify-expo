export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Format Nigerian phone numbers
  if (phone.startsWith('+234')) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(234)(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }
  
  return phone;
};