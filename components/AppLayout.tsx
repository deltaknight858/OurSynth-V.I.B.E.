import React from "react";
import Head from "next/head";
import Shell from "./Shell";

export default function AppLayout({ title, children }) {
  return (
    <Shell>
      <Head>
        <title>{title ? `${title} | OurSynth-Eco` : "OurSynth-Eco"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        {children}
      </div>
    </Shell>
  );
}
