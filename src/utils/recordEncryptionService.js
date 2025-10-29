// Record Encryption Service: per-record data encryption keys (DEKs)
// - Generates random AES-GCM DEK per record
// - Encrypts selected fields with DEK
// - Wraps DEK for each party (patient and doctor) using their RSA-OAEP public keys

import {
  generateAesKey,
  aesEncrypt,
  aesDecrypt,
  exportRawKey,
  importAesRawKey,
  randomBytes,
  rsaWrapAesKey,
  rsaUnwrapAesKey,
  bytesToBase64,
  base64ToBytes,
  utf8ToBytes,
  bytesToUtf8,
} from './webcrypto';

// Fields that need encryption inside medical record payload
const SENSITIVE_FIELDS = ['diagnosis', 'symptoms', 'medicines', 'prescribedTests', 'followUpNotes'];

export async function encryptMedicalRecordPayload(payload, recipients) {
  // recipients: [{ id: 'patientId', publicKey }, { id: 'doctorId', publicKey }]
  const dek = await generateAesKey();
  const dekRaw = await exportRawKey(dek);

  // Encrypt fields
  const encrypted = { ...payload };
  const ivMap = {};
  for (const field of SENSITIVE_FIELDS) {
    if (payload[field] !== undefined && payload[field] !== null && payload[field] !== '') {
      const iv = randomBytes(12);
      const json = JSON.stringify(payload[field]);
      const ct = await aesEncrypt(dek, utf8ToBytes(json), iv);
      encrypted[field] = bytesToBase64(ct);
      ivMap[field] = bytesToBase64(iv);
    }
  }

  // Wrap DEK for every recipient
  const wrappedKeys = {};
  for (const r of recipients) {
    const wrapped = await rsaWrapAesKey(dekRaw, r.publicKey);
    wrappedKeys[r.id] = bytesToBase64(wrapped);
  }

  encrypted._enc = {
    alg: 'AES-GCM-256 + RSA-OAEP-2048/SHA-256',
    iv: ivMap,
    wrappedKeys, // map of userId -> base64(wrapped DEK)
    version: 1,
  };

  return encrypted;
}

export async function decryptMedicalRecordPayload(encryptedPayload, privateKey) {
  if (!encryptedPayload || !encryptedPayload._enc) return encryptedPayload;

  const { wrappedKeys, iv } = encryptedPayload._enc;
  // Determine which wrapped key belongs to current user: caller must resolve it
  // Here we expect caller to provide the correct wrappedKey b64
  throw new Error('decryptMedicalRecordPayload requires wrappedKeyB64 and currentUserId. Use decryptWithWrappedKey');
}

export async function decryptWithWrappedKey(encryptedPayload, wrappedKeyB64, privateKey) {
  // Unwrap DEK
  const wrappedBytes = base64ToBytes(wrappedKeyB64);
  const dekRaw = await rsaUnwrapAesKey(wrappedBytes, privateKey);
  const dek = await importAesRawKey(dekRaw);

  const decrypted = { ...encryptedPayload };
  const ivMap = encryptedPayload._enc?.iv || {};

  for (const field of SENSITIVE_FIELDS) {
    if (encryptedPayload[field] && ivMap[field]) {
      try {
        const ctBytes = base64ToBytes(encryptedPayload[field]);
        const ivBytes = base64ToBytes(ivMap[field]);
        const ptBytes = await aesDecrypt(dek, ctBytes, ivBytes);
        decrypted[field] = JSON.parse(bytesToUtf8(ptBytes));
      } catch (e) {
        decrypted[field] = '[Decryption Failed]';
      }
    }
  }

  return decrypted;
}
