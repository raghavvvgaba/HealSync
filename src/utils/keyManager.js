// Key Manager: handles user key setup and unlocking using Web Crypto
// - Generates RSA-OAEP keypair
// - Derives a KEK (key-encryption-key) from a passphrase via PBKDF2
// - Encrypts private key (PKCS8) using AES-GCM under KEK
// - Stores public key (JWK) + encrypted private key blob + salt + iterations in Firestore user doc

import { db } from "../config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  deriveAesKeyFromPassword,
  generateRsaOaepKeypair,
  exportPublicKeyJwk,
  exportPrivateKeyPkcs8,
  importPrivateKeyPkcs8,
  importPublicKeyJwk,
  randomBytes,
  aesEncrypt,
  aesDecrypt,
  bytesToBase64,
  base64ToBytes,
  utf8ToBytes,
} from "./webcrypto";

const ENC_ITERATIONS = 200_000; // stronger for KEK

export async function ensureUserKeyMaterial(userId, getPassphrase) {
  // If user already has key material, return early
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  const userData = snapshot.exists() ? snapshot.data() : {};

  if (userData.enc && userData.enc.pub && userData.enc.prv && userData.enc.kdfSalt) {
    return { exists: true, publicKeyJwk: userData.enc.pub };
  }

  // Prompt passphrase (caller provides a UI function)
  const passphrase = await getPassphrase("Create encryption passphrase (do not reuse login password)");
  if (!passphrase) throw new Error("Passphrase is required to initialize encryption");

  // Generate RSA keypair
  const { publicKey, privateKey } = await generateRsaOaepKeypair();
  const pubJwk = await exportPublicKeyJwk(publicKey);
  const prvPkcs8 = await exportPrivateKeyPkcs8(privateKey); // ArrayBuffer

  // Derive KEK from passphrase + salt
  const kdfSalt = randomBytes(16);
  const kek = await deriveAesKeyFromPassword(passphrase, kdfSalt, ENC_ITERATIONS);

  // Encrypt private key with KEK under AES-GCM with random IV
  const iv = randomBytes(12);
  const encPrv = await aesEncrypt(kek, prvPkcs8, iv); // ArrayBuffer

  const enc = {
    pub: pubJwk,
    prv: bytesToBase64(encPrv),
    iv: bytesToBase64(iv),
    kdfSalt: bytesToBase64(kdfSalt),
    kdfIterations: ENC_ITERATIONS,
    alg: "RSA-OAEP-2048/SHA-256 + AES-GCM-256",
    createdAt: Date.now(),
  };

  await setDoc(userRef, { enc }, { merge: true });

  // Clear sensitive strings
  return { exists: false, publicKeyJwk: pubJwk };
}

export async function unlockPrivateKey(userId, getPassphrase) {
  // Fetch encrypted material
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists() || !snapshot.data().enc) {
    throw new Error("Encryption not initialized for user");
  }
  const {
    pub: pubJwk,
    prv: b64Prv,
    iv: b64Iv,
    kdfSalt: b64Salt,
    kdfIterations,
  } = snapshot.data().enc;

  const passphrase = await getPassphrase("Enter encryption passphrase");
  if (!passphrase) throw new Error("Passphrase required");

  // Derive KEK and decrypt private key
  const saltBytes = base64ToBytes(b64Salt);
  const ivBytes = base64ToBytes(b64Iv);
  const encPrvBytes = base64ToBytes(b64Prv);

  const kek = await deriveAesKeyFromPassword(passphrase, saltBytes, kdfIterations || ENC_ITERATIONS);
  const prvPkcs8Bytes = await aesDecrypt(kek, encPrvBytes, ivBytes);

  // Import keys
  const privateKey = await importPrivateKeyPkcs8(prvPkcs8Bytes);
  const publicKey = await importPublicKeyJwk(pubJwk);

  // Return handle
  return { publicKey, privateKey };
}
