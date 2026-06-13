import fs from "node:fs";
import path from "node:path";

export function getPublicAssetVersion(filename: string) {
  const assetPath = path.join(process.cwd(), "public", filename);

  try {
    return String(Math.round(fs.statSync(assetPath).mtimeMs));
  } catch {
    return "1";
  }
}
