// src/utils/subscription.js

/**
 * Check whether a user’s plan grants a given feature.
 *
 * - “essential” users get basic analytics & export
 * - “premium” users get everything
 */
export function hasFeature(user, feature) {
  if (!user || !user.subscriptionPlan) return false;
  const plan = user.subscriptionPlan; // 'essential' or 'premium'

  const essentialFeatures = new Set([
    'basicAnalytics',
    'export',
    'smartLinks',
    'emailCapture',
  ]);

  if (essentialFeatures.has(feature)) {
    return plan === 'essential' || plan === 'premium';
  }

  // everything else is true Premium only
  return plan === 'premium';
}
