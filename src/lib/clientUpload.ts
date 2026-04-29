"use client";

type UploadProfile = "listing" | "inspection" | "repair" | "document";

interface UploadOptions {
  profile?: UploadProfile;
  signal?: AbortSignal;
  signature?: CloudinaryUploadSignature;
}

interface UploadProfileSettings {
  maxDimension: number;
  minOptimizeBytes: number;
  quality: number;
}

interface CloudinaryUploadSignature {
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: "auto";
  signature: string;
  timestamp: number;
}

const OUTPUT_IMAGE_TYPE = "image/webp";
const NON_OPTIMIZABLE_IMAGE_TYPES = new Set(["image/gif", "image/svg+xml"]);
const SIGNATURE_CACHE_TTL_MS = 30_000;

const UPLOAD_PROFILES: Record<UploadProfile, UploadProfileSettings> = {
  listing: {
    maxDimension: 1600,
    minOptimizeBytes: 700 * 1024,
    quality: 0.68,
  },
  inspection: {
    maxDimension: 1400,
    minOptimizeBytes: 450 * 1024,
    quality: 0.6,
  },
  repair: {
    maxDimension: 1200,
    minOptimizeBytes: 350 * 1024,
    quality: 0.56,
  },
  document: {
    maxDimension: 1600,
    minOptimizeBytes: 500 * 1024,
    quality: 0.7,
  },
};

let cachedSignature:
  | {
      expiresAt: number;
      value: CloudinaryUploadSignature;
    }
  | null = null;

let signatureRequest: Promise<CloudinaryUploadSignature> | null = null;

function isOptimizableImage(file: File) {
  return file.type.startsWith("image/") && !NON_OPTIMIZABLE_IMAGE_TYPES.has(file.type);
}

function getProfileSettings(profile: UploadProfile) {
  return UPLOAD_PROFILES[profile];
}

function createAbortError() {
  return new DOMException("La subida fue cancelada.", "AbortError");
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw createAbortError();
}

function getOutputFileName(name: string) {
  const baseName = name.replace(/\.[^.]+$/, "") || "upload";
  return `${baseName}.webp`;
}

function getTargetDimensions(width: number, height: number, maxDimension: number) {
  const longestSide = Math.max(width, height);
  if (longestSide <= maxDimension) return { width, height };

  const scale = maxDimension / longestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function loadImage(file: File, signal?: AbortSignal) {
  const objectUrl = URL.createObjectURL(file);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      image.onload = null;
      image.onerror = null;
      signal?.removeEventListener("abort", handleAbort);
    };

    const handleAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    image.onload = () => {
      cleanup();
      resolve(image);
    };

    image.onerror = () => {
      cleanup();
      reject(new Error("No se pudo procesar la imagen."));
    };

    throwIfAborted(signal);
    signal?.addEventListener("abort", handleAbort, { once: true });
    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
  signal?: AbortSignal
) {
  throwIfAborted(signal);

  return new Promise<Blob>((resolve, reject) => {
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", handleAbort);
      callback();
    };

    const handleAbort = () => finish(() => reject(createAbortError()));
    signal?.addEventListener("abort", handleAbort, { once: true });

    canvas.toBlob((blob) => {
      if (signal?.aborted) {
        finish(() => reject(createAbortError()));
        return;
      }

      if (!blob) {
        finish(() => reject(new Error("No se pudo exportar la imagen optimizada.")));
        return;
      }

      finish(() => resolve(blob));
    }, type, quality);
  });
}

async function fetchUploadSignature(signal?: AbortSignal) {
  if (cachedSignature && cachedSignature.expiresAt > Date.now()) {
    return cachedSignature.value;
  }

  if (!signatureRequest) {
    signatureRequest = (async () => {
      const response = await fetch("/api/upload/signature", {
        method: "POST",
        signal,
      });
      const data = await response.json().catch(() => ({}));

      if (
        !response.ok ||
        typeof data.apiKey !== "string" ||
        typeof data.cloudName !== "string" ||
        typeof data.folder !== "string" ||
        typeof data.resourceType !== "string" ||
        typeof data.signature !== "string" ||
        typeof data.timestamp !== "number"
      ) {
        throw new Error(
          typeof data.error === "string" ? data.error : "No se pudo preparar la subida."
        );
      }

      const value = data as CloudinaryUploadSignature;
      cachedSignature = {
        value,
        expiresAt: Date.now() + SIGNATURE_CACHE_TTL_MS,
      };
      return value;
    })().finally(() => {
      signatureRequest = null;
    });
  }

  return signatureRequest;
}

async function uploadToCloudinary(
  file: File,
  signature: CloudinaryUploadSignature,
  signal?: AbortSignal
) {
  throwIfAborted(signal);

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("api_key", signature.apiKey);
  formData.append("folder", signature.folder);
  formData.append("signature", signature.signature);
  formData.append("timestamp", String(signature.timestamp));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`,
    {
      method: "POST",
      body: formData,
      signal,
    }
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok || typeof data.secure_url !== "string") {
    const cloudinaryError =
      typeof data?.error?.message === "string" ? data.error.message : null;
    throw new Error(cloudinaryError ?? "No se pudo subir el archivo.");
  }

  return data.secure_url as string;
}

export function isUploadCancelledError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export async function optimizeImageForUpload(
  file: File,
  { profile = "listing", signal }: UploadOptions = {}
) {
  if (!isOptimizableImage(file)) return file;

  const settings = getProfileSettings(profile);
  const shouldSkipEarly =
    file.size <= settings.minOptimizeBytes &&
    (file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/avif");

  if (shouldSkipEarly) return file;

  try {
    const image = await loadImage(file, signal);
    const { width, height } = getTargetDimensions(
      image.naturalWidth,
      image.naturalHeight,
      settings.maxDimension
    );
    const shouldResize = width !== image.naturalWidth || height !== image.naturalHeight;
    const shouldReencode =
      shouldResize ||
      file.size > settings.minOptimizeBytes ||
      file.type !== OUTPUT_IMAGE_TYPE;

    if (!shouldReencode) return file;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(image, 0, 0, width, height);

    const quality = file.size > 4 * 1024 * 1024 ? Math.max(0.5, settings.quality - 0.06) : settings.quality;
    const blob = await canvasToBlob(canvas, OUTPUT_IMAGE_TYPE, quality, signal);

    if (blob.size >= file.size) return file;

    return new File([blob], getOutputFileName(file.name), {
      type: OUTPUT_IMAGE_TYPE,
      lastModified: file.lastModified,
    });
  } catch {
    throwIfAborted(signal);
    return file;
  }
}

export async function uploadAsset(file: File, options: UploadOptions = {}) {
  const preparedFile = await optimizeImageForUpload(file, options);
  const signature = options.signature ?? (await fetchUploadSignature(options.signal));
  return uploadToCloudinary(preparedFile, signature, options.signal);
}

export async function uploadFiles(files: Iterable<File>, options: UploadOptions = {}) {
  const fileList = Array.from(files);
  if (fileList.length === 0) return { urls: [], cancelled: false };

  const signature = await fetchUploadSignature(options.signal);
  const uploads = await Promise.allSettled(
    fileList.map((file) => uploadAsset(file, { ...options, signature }))
  );
  const urls: string[] = [];
  let cancelled = false;
  let firstError: unknown = null;

  for (const result of uploads) {
    if (result.status === "fulfilled") {
      urls.push(result.value);
      continue;
    }

    if (isUploadCancelledError(result.reason)) {
      cancelled = true;
      continue;
    }

    if (!firstError) firstError = result.reason;
  }

  if (firstError) throw firstError;

  return { urls, cancelled };
}
