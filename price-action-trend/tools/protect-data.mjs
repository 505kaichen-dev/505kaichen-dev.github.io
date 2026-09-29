import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes, webcrypto } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const inputPath = process.argv[2] || "data.js";
const outputPath = process.argv[3] || "protected-data.json";
const iterations = 310000;

function parseData(source) {
  const prefix = "window.PRICE_TREND_DATA = ";
  if (!source.startsWith(prefix)) throw new Error("Input is not a PRICE_TREND_DATA file.");
  return JSON.parse(source.slice(prefix.length).replace(/;\s*$/, ""));
}

async function verifyBrowserCompatibility(password, payload, expectedText) {
  const encoder = new TextEncoder();
  const passwordKey = await webcrypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt: Buffer.from(payload.salt, "base64"), iterations: payload.iterations, hash: "SHA-256" },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const decrypted = await webcrypto.subtle.decrypt(
    { name: "AES-GCM", iv: Buffer.from(payload.iv, "base64"), tagLength: 128 },
    key,
    Buffer.from(payload.ciphertext, "base64")
  );
  if (new TextDecoder().decode(decrypted) !== expectedText) throw new Error("Browser-compatible decryption check failed.");
}

async function protect(password) {
  if (!password) throw new Error("Password cannot be empty.");
  const source = readFileSync(inputPath, "utf8");
  const plainText = JSON.stringify(parseData(source));
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const ciphertext = Buffer.concat([encrypted, authTag]);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const verified = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  if (verified !== plainText) throw new Error("Encryption self-check failed.");

  const payload = {
    version: 1,
    algorithm: "AES-256-GCM",
    kdf: "PBKDF2-SHA256",
    iterations,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
  await verifyBrowserCompatibility(password, payload, plainText);
  writeFileSync(outputPath, JSON.stringify(payload), "utf8");
  process.stdout.write(`Encrypted data written to ${outputPath}\n`);
}

async function run(password) {
  try {
    await protect(password);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.env.PRICE_TREND_PASSWORD) {
  await run(process.env.PRICE_TREND_PASSWORD);
} else {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  prompt.question("Password: ", async password => {
    prompt.close();
    await run(password);
  });
}
