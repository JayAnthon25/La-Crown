import React from "react";
import Head from "next/head";

export default function HeadInject({ children }) {
  return (
    <div>
      <Head>
        <title>La Crown</title>
        <meta
          name="description"
          content="Automatic Tabulation for University Events"
        />
        <link rel="icon" href="/crown.ico" />
      </Head>

      {children}
    </div>
  );
}
