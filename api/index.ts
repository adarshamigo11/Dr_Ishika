import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/router.js";
import { createContext } from "../server/context.js";
import fs from "fs";
import path from "path";

const app = new Hono();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Serve static files and handle SPA routing
app.use("/*", async (c) => {
  const reqPath = c.req.path;
  const distPath = path.resolve("dist/public");
  
  // Try to serve the requested file
  let filePath = path.join(distPath, reqPath === "/" ? "index.html" : reqPath);
  
  // If it's a directory or doesn't exist, serve index.html (SPA routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distPath, "index.html");
  }
  
  // If index.html doesn't exist, return 404
  if (!fs.existsSync(filePath)) {
    return c.json({ error: "Not Found" }, 404);
  }
  
  const content = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1);
  const contentType = {
    html: "text/html",
    js: "application/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    webp: "image/webp",
  }[ext] || "application/octet-stream";
  
  return new Response(content, { headers: { "Content-Type": contentType } });
});

export default app;
