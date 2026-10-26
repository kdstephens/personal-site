import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL("../../dist/", import.meta.url));

/** Version asset URLs so browser caches cannot keep styling from an older build. */
export const assetUrlFilter = () => (assetPath) => {
  try {
    const contents = readFileSync(join(outputDirectory, assetPath));
    const hash = createHash("sha256").update(contents).digest("hex").slice(0, 12);
    return `${assetPath}?v=${hash}`;
  } catch (error) {
    // During initial development startup the asset watchers may still be building.
    if (error.code === "ENOENT") return assetPath;
    throw error;
  }
};
