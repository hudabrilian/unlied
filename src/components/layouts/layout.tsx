import { type ReactNode } from "react";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import { Toaster } from "../ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Layout({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") {
    void router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Unlied</title>
        <meta
          name="description"
          content="An online platform for heartfelt confessions and messages."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content="An online platform for heartfelt confessions and messages."
        />
        <meta
          property="og:description"
          content="An online platform for heartfelt confessions and messages."
        />
        <meta property="og:url" content="https://unlied.brilian.me/" />
        <meta property="og:type" content="website" />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
