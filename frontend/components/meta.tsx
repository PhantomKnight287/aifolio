// code taken from https://github.com/phantomknight287/lend-my-skill
import Head from "next/head";
import { FC } from "react";

interface MetaTagsProps {
  title: string;
  description: string;
  ogImage?: string;
}

const MetaTags: FC<MetaTagsProps> = ({ description, title, ogImage }) => {
  return (
    <Head>
      <>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        {/* generate random color */}
        <meta
          name="theme-color"
          content={"#" + Math.floor(Math.random() * 16777215).toString(16)}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="https://lendmyskill.com" /> */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage || "/image.png"} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:url" content="https://lendmyskill.com" /> */}
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage || "/image.png"} />
      </>
    </Head>
  );
};

export { MetaTags };
