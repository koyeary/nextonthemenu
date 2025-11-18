// Edge-compatible JWT verification using Web Crypto

export async function verifyJwtEdge(token: string, secret: string) {
  try {
    const [header, payload, signature] = token.split(".");

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(atob(signature), (c) => c.charCodeAt(0)),
      encoder.encode(`${header}.${payload}`)
    );

    if (!valid) return null;

    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
