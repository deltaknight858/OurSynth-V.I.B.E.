
import React from "react";
import Head from "next/head";
import Shell from "./Shell";
import TopBarTabs from "./TopBarTabs";


export default function AppLayout({ title, children }) {
  return (
    <Shell>
      <Head>
        <title>{title ? `${title} | OurSynth-Eco` : "OurSynth-Eco"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <TopBarTabs />
      <div>
        {children}
      </div>
    </Shell>
  );
}
