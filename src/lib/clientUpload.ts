"use client";

const MAX_UPLOAD_DIMENSION = 1800;
const MIN_SIZE_TO_OPTIMIZE_BYTES = 900 * 1024;
const OUTPUT_IMAGE_TYPE = "image/webp";
const NON_OPTIMIZABLE_IMAGE_TYPES = new Set(["image/gif", "image/svg+xml"]);

function isOptimizableImage(file: File) {
  return file.type.startsWith("image/") && !NON_OPTIMIZABLE_IMAGE_TYPES.has(file.type);
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

function loadImage(file: File) {
  const objectUrl = URL.createObjectURL(file);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo procesar la imagen."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("No se pudo exportar la imagen optimizada."));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
}

export async function optimizeImageForUpload(file: File) {
  if (!isOptimizableImage(file)) return file;

  const shouldSkipEarly =
    file.size <= MIN_SIZE_TO_OPTIMIZE_BYTES &&
    (file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/avif");

  if (shouldSkipEarly) return file;

  try {
    const image = await loadImage(file);
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
    const blob = await canvasToBlob(canvas, OUTPUT_IMAGE_TYPE, quality);

    if (blob.size >= file.size) return file;

    return new File([blob], getOutputFileName(file.name, OUTPUT_IMAGE_TYPE), {
      type: OUTPUT_IMAGE_TYPE,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

export async function uploadAsset(file: File) {
  const preparedFile = await optimizeImageForUpload(file);
  const formData = new FormData();

  formData.append("file", preparedFile, preparedFile.name);

  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || typeof data.url !== "string") {
    throw new Error(typeof data.error === "string" ? data.error : "No se pudo subir el archivo.");
  }

  return data.url as string;
}
