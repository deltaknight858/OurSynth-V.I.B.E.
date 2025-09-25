import BaseLayout from "../layout/BaseLayout";

/**
 * NPPage Component - Client-side only
 * @param {string} html - Pre-loaded HTML content from getStaticProps
 * @param {string} cssFile - Scoped CSS import path
 * @param {string} title - Page title for <head>
 */

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
