import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs/promises";

type PrerenderOptions = {
  distDir: string;
  routes: string[];
  port?: number;
};

function normalizeRoute(route: string) {
  if (route === "/") return "/";
  return route.startsWith("/") ? route : `/${route}`;
}

function routeToFilePath(distDir: string, route: string) {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.slice(1), "index.html");
}

export async function prerender({ distDir, routes, port = 4173 }: PrerenderOptions) {
  let browser: import("puppeteer").Browser | null = null;
  let server: import("http").Server | null = null;
  const absoluteDistDir = path.resolve(process.cwd(), distDir);

  try {
    const puppeteer = await import("puppeteer");
    const app = express();
    app.use(express.static(absoluteDistDir));
    app.use("*", (_req, res) => {
      res.sendFile(path.join(absoluteDistDir, "index.html"));
    });

    server = createServer(app);
    await new Promise<void>((resolve) => {
      server?.listen(port, "127.0.0.1", () => resolve());
    });

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1365, height: 768 });

    for (const rawRoute of routes) {
      const route = normalizeRoute(rawRoute);
      const url = `http://127.0.0.1:${port}${route}`;
      const outputPath = routeToFilePath(absoluteDistDir, route);

      await page.goto(url, { waitUntil: "networkidle0" });
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          return !!root && root.children.length > 0;
        },
        { timeout: 10000 },
      );

      const html = await page.content();
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html, "utf-8");
      console.log(`prerendered ${route} -> ${path.relative(process.cwd(), outputPath)}`);
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      await new Promise<void>((resolve) => server?.close(() => resolve()));
    }
  }
}
