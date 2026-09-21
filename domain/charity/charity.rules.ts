export class CharityValidationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'CharityValidationError';
  }
}

export function validateContributionPercentage(percentage: number): void {
  if (!Number.isInteger(percentage) || percentage < 10 || percentage > 100) {
    throw new CharityValidationError(
      `Charity contribution percentage must be an integer between 10% and 100%. Received: ${percentage}`,
      'INVALID_CHARITY_PERCENTAGE'
    );
  }
}

export function calculateCharityContributionAmount(
  subscriptionAmountMinor: number,
  percentage: number
): number {
  validateContributionPercentage(percentage);
  return Math.floor((subscriptionAmountMinor * percentage) / 100);
}
