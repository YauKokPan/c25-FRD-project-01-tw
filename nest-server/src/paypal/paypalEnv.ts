// paypalEnv.ts
import { Configuration } from '@paypal/checkout-server-sdk';
import { PayPalHttpClient } from '@paypal/checkout-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = () => {
  if (process.env.NODE_ENV === 'production') {
    return new Configuration.LiveEnvironment(clientId, clientSecret);
  } else {
    return new Configuration.SandboxEnvironment(clientId, clientSecret);
  }
};

export default function client() {
  return new PayPalHttpClient(environment());
}
