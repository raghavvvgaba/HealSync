// Web Crypto utilities for PBKDF2, AES-GCM, RSA-OAEP
// Browser-only: uses window.crypto.subtle

const subtle = globalThis.crypto && globalThis.crypto.subtle ? globalThis.crypto.subtle : null;

if (!subtle) {
  // Non-fatal: allow importing in Node contexts without execution
  // Actual calls will throw helpful errors
}

function ensureSubtle() {
  if (!subtle) {
    throw new Error("Web Crypto API not available. Run in a secure browser context (HTTPS).");
  }
  return subtle;
}

// ----- Encoding helpers -----
export function utf8ToBytes(str) {
  return new TextEncoder().encode(str);
}

export function bytesToUtf8(bytes) {
  return new TextDecoder().decode(bytes);
}

export function bytesToBase64(bytes) {
  // Browser-safe base64 from ArrayBuffer
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin);
}

export function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export function randomBytes(len) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return arr.buffer;
}

// ----- PBKDF2 -> AES-GCM 256-bit key -----
export async function deriveAesKeyFromPassword(password, saltBytes, iterations = 100000) {
  const s = ensureSubtle();
  const pwBytes = utf8ToBytes(password);
  const baseKey = await s.importKey('raw', pwBytes, { name: 'PBKDF2' }, false, ['deriveKey']);
  const aesKey = await s.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return aesKey;
}

// ----- AES-GCM helpers -----
export async function generateAesKey() {
  const s = ensureSubtle();
  return s.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

export async function aesEncrypt(aesKey, plaintextBytes, ivBytes) {
  const s = ensureSubtle();
  const ct = await s.encrypt({ name: 'AES-GCM', iv: ivBytes }, aesKey, plaintextBytes);
  return ct; // ArrayBuffer
}

export async function aesDecrypt(aesKey, ciphertextBytes, ivBytes) {
  const s = ensureSubtle();
  const pt = await s.decrypt({ name: 'AES-GCM', iv: ivBytes }, aesKey, ciphertextBytes);
  return pt; // ArrayBuffer
}

export async function exportRawKey(aesKey) {
  const s = ensureSubtle();
  return s.exportKey('raw', aesKey); // ArrayBuffer
}

export async function importAesRawKey(rawBytes) {
  const s = ensureSubtle();
  return s.importKey('raw', rawBytes, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

// ----- RSA-OAEP SHA-256 keypair + wrap/unwrap -----
export async function generateRsaOaepKeypair() {
  const s = ensureSubtle();
  return s.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function exportPublicKeyJwk(publicKey) {
  const s = ensureSubtle();
  return s.exportKey('jwk', publicKey); // JSON Web Key
}

export async function exportPrivateKeyPkcs8(privateKey) {
  const s = ensureSubtle();
  return s.exportKey('pkcs8', privateKey); // ArrayBuffer
}

export async function importPublicKeyJwk(jwk) {
  const s = ensureSubtle();
  return s.importKey(
    'jwk',
    jwk,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );
}

export async function importPrivateKeyPkcs8(pkcs8Bytes) {
  const s = ensureSubtle();
  return s.importKey(
    'pkcs8',
    pkcs8Bytes,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );
}

export async function rsaWrapAesKey(aesRawKeyBytes, publicKey) {
  const s = ensureSubtle();
  // Wrap raw AES key bytes under RSA-OAEP public key (encrypt)
  const wrapped = await s.encrypt({ name: 'RSA-OAEP' }, publicKey, aesRawKeyBytes);
  return wrapped; // ArrayBuffer
}

export async function rsaUnwrapAesKey(wrappedBytes, privateKey) {
  const s = ensureSubtle();
  // Unwrap wrapped AES key bytes using RSA private key (decrypt)
  const raw = await s.decrypt({ name: 'RSA-OAEP' }, privateKey, wrappedBytes);
  return raw; // ArrayBuffer (raw AES key)
}
