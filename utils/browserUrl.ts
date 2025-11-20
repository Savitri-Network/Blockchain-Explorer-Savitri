const trimSlashes = (value: string): string => value.replace(/^\/+|\/+$/g, "");

export const getAppOrigin = (): string => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return "";
};

export const buildPublicAppUrl = (...segments: string[]): string => {
  const origin = getAppOrigin();
  const cleanedSegments = segments.filter(Boolean).map(trimSlashes);

  if (!origin) {
    if (cleanedSegments.length === 0) {
      return "";
    }
    return `/${cleanedSegments.join("/")}`;
  }

  if (cleanedSegments.length === 0) {
    return origin;
  }

  return `${origin}/${cleanedSegments.join("/")}`;
};
