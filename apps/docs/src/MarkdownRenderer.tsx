import React from "react";
import ReactMarkdown from "react-markdown";
import fs from "fs";
import path from "path";

export default function MarkdownRenderer({ filePath }: { filePath: string }) {
  // For SSR: read file from disk. For client: fetch from API.
  let content = "";
  try {
    content = fs.readFileSync(path.resolve("../docs", filePath), "utf-8");
  } catch (e) {
    content = "File not found.";
  }
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
