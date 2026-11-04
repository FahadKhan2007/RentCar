import { useContext } from 'react';
import { RentalContext } from './RentalContextInstance';

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};

