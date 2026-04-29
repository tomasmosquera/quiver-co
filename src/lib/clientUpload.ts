"use client";

const MAX_UPLOAD_DIMENSION = 1800;
const MIN_SIZE_TO_OPTIMIZE_BYTES = 900 * 1024;
const OUTPUT_IMAGE_TYPE = "image/webp";
const NON_OPTIMIZABLE_IMAGE_TYPES = new Set(["image/gif", "image/svg+xml"]);

interface UploadOptions {
  signal?: AbortSignal;
}

function isOptimizableImage(file: File) {
  return file.type.startsWith("image/") && !NON_OPTIMIZABLE_IMAGE_TYPES.has(file.type);
}

function createAbortError() {
  return new DOMException("La subida fue cancelada.", "AbortError");
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw createAbortError();
}

function getOutputFileName(name: string, mimeType: string) {
  const baseName = name.replace(/\.[^.]+$/, "") || "upload";
  const extension = mimeType === "image/webp" ? "webp" : "jpg";
  return `${baseName}.${extension}`;
}

function getTargetDimensions(width: number, height: number) {
  const longestSide = Math.max(width, height);
  if (longestSide <= MAX_UPLOAD_DIMENSION) return { width, height };

  const scale = MAX_UPLOAD_DIMENSION / longestSide;
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

export function isUploadCancelledError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export async function optimizeImageForUpload(file: File, { signal }: UploadOptions = {}) {
  if (!isOptimizableImage(file)) return file;

  const shouldSkipEarly =
    file.size <= MIN_SIZE_TO_OPTIMIZE_BYTES &&
    (file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/avif");

  if (shouldSkipEarly) return file;

  try {
    const image = await loadImage(file, signal);
    const { width, height } = getTargetDimensions(image.naturalWidth, image.naturalHeight);
    const shouldResize = width !== image.naturalWidth || height !== image.naturalHeight;
    const shouldReencode =
      shouldResize ||
      file.size > MIN_SIZE_TO_OPTIMIZE_BYTES ||
      file.type !== OUTPUT_IMAGE_TYPE;

    if (!shouldReencode) return file;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(image, 0, 0, width, height);

    const quality = file.size > 4 * 1024 * 1024 ? 0.68 : 0.74;
    const blob = await canvasToBlob(canvas, OUTPUT_IMAGE_TYPE, quality, signal);

    if (blob.size >= file.size) return file;

    return new File([blob], getOutputFileName(file.name, OUTPUT_IMAGE_TYPE), {
      type: OUTPUT_IMAGE_TYPE,
      lastModified: file.lastModified,
    });
  } catch {
    throwIfAborted(signal);
    return file;
  }
}

export async function uploadAsset(file: File, { signal }: UploadOptions = {}) {
  const preparedFile = await optimizeImageForUpload(file, { signal });
  const formData = new FormData();

  formData.append("file", preparedFile, preparedFile.name);

  throwIfAborted(signal);

  const response = await fetch("/api/upload", { method: "POST", body: formData, signal });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || typeof data.url !== "string") {
    throw new Error(typeof data.error === "string" ? data.error : "No se pudo subir el archivo.");
  }

  return data.url as string;
}

export async function uploadFiles(files: Iterable<File>, options: UploadOptions = {}) {
  const uploads = await Promise.allSettled(Array.from(files, (file) => uploadAsset(file, options)));
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
