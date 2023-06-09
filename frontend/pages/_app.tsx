import { Header } from "@/components/header";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { AppProps } from "next/app";
import { useState } from "react";
import "../styles/globals.css";
import { sen } from "@/fonts";
import NextNProgress from "nextjs-progressbar";

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <NextNProgress />
      <Header />
      <div className={sen.className}>
        <Component {...pageProps} />
      </div>
    </SessionContextProvider>
  );
}
