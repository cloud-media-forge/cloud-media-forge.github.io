"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";

type FormState = {
  url: string;
  key: string;
  salt: string;
};

type FormErrors = Partial<FormState>;

const HEX_REGEX = /^[0-9a-fA-F]+$/;

function hexToBytes(input: string): Uint8Array {
  const hex = input.trim();
  if (hex.length % 2 !== 0) {
    throw new Error("Hex values must contain an even number of characters.");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = hex.substring(i * 2, i * 2 + 2);
    const parsed = Number.parseInt(byte, 16);
    if (Number.isNaN(parsed)) {
      throw new Error("Failed to parse hex-encoded data.");
    }
    bytes[i] = parsed;
  }

  return bytes;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function signPath({
  keyHex,
  saltHex,
  path,
}: {
  keyHex: string;
  saltHex: string;
  path: string;
}): Promise<string> {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error("Web Crypto API is not available in this environment.");
  }

  const keyBytes = hexToBytes(keyHex);
  const saltBytes = hexToBytes(saltHex);
  const pathBytes = new TextEncoder().encode(path);
  const payload = new Uint8Array(saltBytes.length + pathBytes.length);

  payload.set(saltBytes);
  payload.set(pathBytes, saltBytes.length);

  const cryptoKey = await subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await subtle.sign(
    "HMAC",
    cryptoKey,
    payload.buffer as ArrayBuffer,
  );

  return encodeBase64Url(new Uint8Array(digest));
}

export default function SigningDemo() {
  const [form, setForm] = useState<FormState>({ url: "", key: "", salt: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  function validateInputs(nextForm: FormState): FormErrors {
    const nextErrors: FormErrors = {};
    const trimmedUrl = nextForm.url.trim();
    const trimmedKey = nextForm.key.trim();
    const trimmedSalt = nextForm.salt.trim();

    if (!trimmedUrl) {
      nextErrors.url = "Enter the path segment to sign.";
    } else if (!trimmedUrl.startsWith("/")) {
      nextErrors.url =
        "Include the leading slash (example: /800x600ex/plain/...).";
    }

    if (!trimmedKey) {
      nextErrors.key = "Key is required.";
    } else if (!HEX_REGEX.test(trimmedKey)) {
      nextErrors.key = "Key must be hexadecimal characters (0-9, a-f).";
    } else if (trimmedKey.length % 2 !== 0) {
      nextErrors.key = "Key length must be even.";
    }

    if (!trimmedSalt) {
      nextErrors.salt = "Salt is required.";
    } else if (!HEX_REGEX.test(trimmedSalt)) {
      nextErrors.salt = "Salt must be hexadecimal characters (0-9, a-f).";
    } else if (trimmedSalt.length % 2 !== 0) {
      nextErrors.salt = "Salt length must be even.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedForm: FormState = {
      url: form.url.trim(),
      key: form.key.trim(),
      salt: form.salt.trim(),
    };
    const nextErrors = validateInputs(trimmedForm);

    setErrors(nextErrors);
    setSubmitError(null);
    setSignature(null);
    setSignedUrl(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSigning(true);

    try {
      const newSignature = await signPath({
        keyHex: trimmedForm.key,
        saltHex: trimmedForm.salt,
        path: trimmedForm.url,
      });
      setSignature(newSignature);
      setSignedUrl(`${newSignature}${trimmedForm.url}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to generate signature. Double-check your inputs.",
      );
    } finally {
      setIsSigning(false);
    }
  }

  function handleInputChange(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor="url-input"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            URL path (include processing options)
          </label>
          <input
            id="url-input"
            type="text"
            name="url"
            autoComplete="off"
            spellCheck="false"
            placeholder="/800x600ex/plain/https://example.com/cat.jpg.webp"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            value={form.url}
            onChange={handleInputChange("url")}
          />
          {errors.url ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.url}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="key-input"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            IMGFLUX_KEY (hex)
          </label>
          <input
            id="key-input"
            type="text"
            name="key"
            autoComplete="off"
            spellCheck="false"
            placeholder="d1f5e6..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            value={form.key}
            onChange={handleInputChange("key")}
          />
          {errors.key ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.key}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="salt-input"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            IMGFLUX_SALT (hex)
          </label>
          <input
            id="salt-input"
            type="text"
            name="salt"
            autoComplete="off"
            spellCheck="false"
            placeholder="6bb72c..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            value={form.salt}
            onChange={handleInputChange("salt")}
          />
          {errors.salt ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.salt}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-400"
          disabled={isSigning}
        >
          {isSigning ? "Signing..." : "Generate signed URL"}
        </button>
      </form>
      {submitError ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {submitError}
        </p>
      ) : null}
      {signature ? (
        <div className="mt-6 space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
          <div>
            <p className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              Signature
            </p>
            <code className="break-all">{signature}</code>
          </div>
          <div>
            <p className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              Signed URL
            </p>
            <code className="break-all">{signedUrl}</code>
          </div>
          <div>
            <p className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              Example URL
            </p>
            <code className="break-all">
              https://image.example.com/{signedUrl}
            </code>
          </div>
        </div>
      ) : null}
    </div>
  );
}
