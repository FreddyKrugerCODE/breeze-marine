# Stripe Integration Setup Guide

This guide will help you set up Stripe integration for the Breeze Marine application.

## Prerequisites

1. A Stripe account (you can sign up at [stripe.com](https://stripe.com))
2. Access to your Stripe Dashboard

## Steps to Set Up Stripe

### 1. Get Your API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/login)
2. Go to Developers > API keys
3. You'll need two keys:
   - **Publishable Key**: Starts with `pk_test_` (for test mode) or `pk_live_` (for live mode)
   - **Secret Key**: Starts with `sk_test_` (for test mode) or `sk_live_` (for live mode)

### 2. Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

\`\`\`
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

Replace `pk_test_your_publishable_key` and `sk_test_your_secret_key` with your actual Stripe API keys.

### 3. Install Required Dependencies

Make sure you have the necessary dependencies installed:

\`\`\`bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
\`\`\`

### 4. Test the Integration

1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to the trailer rental page and attempt to make a payment
3. Use Stripe's test card numbers for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

### 5. Verify Payments in Stripe Dashboard

After making test payments, you can verify them in your Stripe Dashboard under "Payments".

## Troubleshooting

If you encounter "Stripe configuration error":

1. Verify that your API keys are correct
2. Check that the environment variables are properly loaded
3. Ensure the Stripe package is correctly installed
4. Check server logs for more detailed error messages

For more help, refer to the [Stripe API Documentation](https://stripe.com/docs/api).
