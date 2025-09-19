import fs from "fs";
import path from "path";
import Link from "next/link";
import BaseLayout from "../components/layout/BaseLayout";

export async function getStaticProps() {
  const dirPath = path.join(process.cwd(), "public/np");
  const files = fs.readdirSync(dirPath);

  // Core pages you want pinned at the top
  const corePages = [
    { slug: "", title: "Home" },
    { slug: "workspace", title: "Workspace" },
    { slug: "history", title: "History" },
    { slug: "command-center", title: "Command Center" },
    { slug: "about", title: "About" },
  ];

  // All HTML files in /public/np
  const allSlugs = files
    .filter((file) => file.endsWith(".html"))
    .map((file) => file.replace(".html", ""));

  // Dynamic pages = all minus core
  const dynamicPages = allSlugs
    .filter((slug) => !corePages.some((p) => p.slug === slug))
    .map((slug) => ({
      slug,
      title: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    }));

  return { props: { corePages, dynamicPages } };
}

export default function PagesIndex({ corePages, dynamicPages }) {
  return (
    <BaseLayout title="Pages Index">
      <h1>📑 OurSynth Labs – Pages Index</h1>

      <section>
        <h2>Core Pages</h2>
        <ul>
          {corePages.map(({ slug, title }) => (
            <li key={slug || "home"}>
              <Link href={`/${slug}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </section>

      {dynamicPages.length > 0 && (
        <section>
          <h2>Dynamic Pages</h2>
          <ul>
            {dynamicPages.map(({ slug, title }) => (
              <li key={slug}>
                <Link href={`/${slug}`}>{title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dynamicPages.length === 0 && (
        <p><em>No dynamic pages yet — drop a Nicepage export into /public/np/ to add one.</em></p>
      )}
    </BaseLayout>
  );
}
