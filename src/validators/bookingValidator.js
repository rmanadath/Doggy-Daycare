export const validateBookingInput = (data) => {
  const errors = [];

  if (!data.dogId) {
    errors.push('dogId is required');
  }

  if (!data.date) {
    errors.push('date is required');
  }

  if (!data.checkInTime) {
    errors.push('checkInTime is required');
  }

  if (!data.checkOutTime) {
    errors.push('checkOutTime is required');
  }

  // Validate services array if provided
  if (data.services && !Array.isArray(data.services)) {
    errors.push('services must be an array');
  }

  if (data.services && data.services.length > 0) {
    data.services.forEach((service, index) => {
      if (!service.serviceId) {
        errors.push(`services[${index}].serviceId is required`);
      }
      if (service.quantity && service.quantity < 1) {
        errors.push(`services[${index}].quantity must be at least 1`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateStatusUpdate = (status) => {
  const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  
  if (!status) {
    return { isValid: false, errors: ['status is required'] };
  }

  if (!validStatuses.includes(status)) {
    return { 
      isValid: false, 
      errors: [`status must be one of: ${validStatuses.join(', ')}`] 
    };
  }

  return { isValid: true, errors: [] };
};