import Head from "next/head";

export default function BaseLayout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? `${title} – OurSynth Labs` : "OurSynth Labs"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="np-shell">{children}</main>
    </>
  );
}
