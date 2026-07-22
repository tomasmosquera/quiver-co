export const COMMISSION_RATE = 0.1;

export function sellerNetAmount(amount: number) {
  return Math.round(amount * (1 - COMMISSION_RATE));
}
