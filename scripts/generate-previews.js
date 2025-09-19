const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const pages = [
  "", // Home
  "workspace",
  "history",
  "command-center",
  "about",
  // Dynamic pages will be discovered automatically
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const baseUrl = process.env.PREVIEW_BASE_URL || "http://localhost:3000";

  // Scan /public/np for dynamic pages
  const npDir = path.join(process.cwd(), "public/np");
  const files = fs.readdirSync(npDir)
    .filter(f => f.endsWith(".html"))
    .map(f => f.replace(".html", ""))
    .filter(slug => !pages.includes(slug));

  const allSlugs = [...pages, ...files];

  // Ensure previews directory exists
  const previewsDir = path.join(process.cwd(), "public/previews");
  if (!fs.existsSync(previewsDir)) {
    fs.mkdirSync(previewsDir);
  }

  for (const slug of allSlugs) {
    const url = `${baseUrl}/${slug}`;
    console.log(`📸 Capturing ${url}...`);
    await page.goto(url, { waitUntil: "networkidle2" });
    const filePath = path.join(previewsDir, `${slug || "home"}.jpg`);
    await page.screenshot({ path: filePath, type: "jpeg", quality: 80 });
  }

  await browser.close();
  console.log("✅ Previews generated!");
})();
