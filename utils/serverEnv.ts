const getRequiredServerEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const stripTrailingSlashes = (value: string): string => value.replace(/\/+$/, "");
const trimSlashes = (value: string): string => value.replace(/^\/+|\/+$/g, "");

export const API_DATA_BASE_URL = stripTrailingSlashes(getRequiredServerEnv("PROMETEO_API_DATA_BASE_URL"));

export const buildApiUrl = (...segments: string[]): string => {
  const cleanedSegments = segments.filter(Boolean).map(trimSlashes);
  if (cleanedSegments.length === 0) {
    return API_DATA_BASE_URL;
  }

  return `${API_DATA_BASE_URL}/${cleanedSegments.join("/")}`;
};
