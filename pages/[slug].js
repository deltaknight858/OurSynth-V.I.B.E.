import fs from "fs";
import path from "path";
import NPPage from "../components/np/NPPage";

export async function getStaticPaths() {
  const dirPath = path.join(process.cwd(), "public/np");
  const files = fs.readdirSync(dirPath);

  const corePages = ["index", "workspace", "history", "command-center", "about"];

  const paths = files
    .filter((file) => file.endsWith(".html"))
    .map((file) => file.replace(".html", ""))
    .filter((slug) => !corePages.includes(slug))
    .map((slug) => ({ params: { slug } }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), "public/np", `${slug}.html`);
  const html = fs.readFileSync(filePath, "utf8");

  const cssPath = path.join(process.cwd(), "styles/scoped", `np-${slug}.css`);
  const cssFile = fs.existsSync(cssPath)
    ? `../styles/scoped/np-${slug}.css`
    : null;

  return { props: { html, slug, cssFile } };
}

export default function DynamicNPPage({ html, slug, cssFile }) {
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return <NPPage html={html} cssFile={cssFile} title={title} />;
}
