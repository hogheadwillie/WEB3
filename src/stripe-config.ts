export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_SxSrIkL3p3cKNz',
    priceId: 'price_1S1XvP3Q3A8giusRTENwkc12',
    name: 'Advanced Quantum Encryption',
    description: 'Premium quantum encryption service with advanced security features and unlimited quantum key generation.',
    mode: 'subscription',
    price: 40.00,
    currency: 'usd',
  },
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};