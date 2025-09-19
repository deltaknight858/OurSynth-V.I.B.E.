import fs from "fs";
import path from "path";
import BaseLayout from "../layout/BaseLayout";

/**
 * NPPage Component
 * @param {string} fileName - HTML file name in /public/np/
 * @param {string} cssFile - Scoped CSS import path
 * @param {string} title - Page title for <head>
 */
export function getNPStaticProps(fileName) {
  return async function getStaticProps() {
    const filePath = path.join(process.cwd(), "public/np", fileName);
    const html = fs.readFileSync(filePath, "utf8");
    return { props: { html } };
  };
}

export default function NPPage({ html, cssFile, title }) {
  // Dynamically import scoped CSS
  if (cssFile) {
    // eslint-disable-next-line global-require
    require(cssFile);
  }

  return (
    <BaseLayout title={title}>
      <div
        className="np-shell"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </BaseLayout>
  );
}
