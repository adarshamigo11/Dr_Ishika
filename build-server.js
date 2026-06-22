import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";

const banner = `import { createRequire } from 'module';const require = createRequire(import.meta.url);`;

async function build() {
  await esbuild.build({
    entryPoints: ["api/boot.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: "dist/boot.js",
    banner: { js: banner },
    external: [
      "mongodb",
      "@hono/node-server",
      "dotenv",
    ],
    define: {
      "import.meta.dirname": "__dirname",
    },
  });

  // Copy public assets to dist
  const publicDir = path.resolve("public");
  const distPublicDir = path.resolve("dist/public");
  
  if (fs.existsSync(publicDir)) {
    if (!fs.existsSync(distPublicDir)) {
      fs.mkdirSync(distPublicDir, { recursive: true });
    }
    
    function copyDir(src, dest) {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyDir(publicDir, distPublicDir);
  }

  console.log("Build completed successfully!");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
