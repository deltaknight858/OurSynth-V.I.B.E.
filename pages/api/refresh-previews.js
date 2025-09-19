import { exec } from "child_process";
import path from "path";

export default function handler(req, res) {
  // Optional: restrict to dev mode unless you set ALLOW_REFRESH=true
  if (process.env.NODE_ENV !== "development" && process.env.ALLOW_REFRESH !== "true") {
    return res.status(403).json({ error: "Refresh disabled in production" });
  }

  const scriptPath = path.join(process.cwd(), "scripts/generate-previews.js");

  exec(`node "${scriptPath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "Preview generation failed" });
    }
    console.log(stdout);
    res.status(200).json({ message: "Previews refreshed successfully" });
  });
}
