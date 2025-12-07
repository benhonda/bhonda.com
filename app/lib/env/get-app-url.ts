export function getAppUrl(path?: string): string {
  const fqdn = window.env?.PUBLIC_APP_FQDN || "localhost:3000";
  const protocol = fqdn.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${fqdn}`;

  if (path) {
    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  }

  return baseUrl;
}

/**
 * Get just the FQDN without protocol
 */
export function getAppFqdn(): string {
  return window.env?.PUBLIC_APP_FQDN || "localhost:3000";
}
