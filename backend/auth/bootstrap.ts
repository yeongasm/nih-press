import crypto from 'crypto';
import fs from 'fs';
import { PUBLIC_KEY_PATH, PRIVATE_KEY_PATH } from '../util/paths';

function bootstrap() {

  // This is a bootstrapper, we only need to do this when the file has not existed.
  let hasPublicKey: boolean = true;
  let hasPrivateKey: boolean = true;

  // Ugly but it works ¯\_(ツ)_/¯
  try {
    fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
    fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
  } catch(e) {
    hasPublicKey = false;
    hasPrivateKey = false;
  }

  if (hasPublicKey && hasPrivateKey)
    return;

  //
  // Code taken from: https://github.com/zachgoll/express-jwt-authentication-starter/blob/final/generateKeypair.js
  //
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem' // Most common formatting choice
    },
    privateKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem' // Most common formatting choice
    }
  });

  // Create the public key file
  fs.writeFileSync(PUBLIC_KEY_PATH, keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(PRIVATE_KEY_PATH, keyPair.privateKey);
};

bootstrap();
