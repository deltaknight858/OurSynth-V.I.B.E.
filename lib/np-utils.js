import fs from "fs";
import path from "path";

/**
 * Server-side utility to load NP HTML files
 * This function should only be used in getStaticProps or getServerSideProps
 * @param {string} fileName - HTML file name in /public/np/
 */
export function getNPStaticProps(fileName) {
  return async function getStaticProps() {
    const filePath = path.join(process.cwd(), "public/np", fileName);
    const html = fs.readFileSync(filePath, "utf8");
    return { props: { html } };
  };
}