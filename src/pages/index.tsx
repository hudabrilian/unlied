import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Footer from "~/components/footer/footer";
import TextLogo from "~/components/text-logo";
import { Button } from "~/components/ui/button";

export default function Home() {
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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="absolute -z-10 h-screen w-screen bg-gradient-to-r from-[#B993D6] to-[#8CA6DB] dark:from-[#606c88] dark:to-[#3f4c6b]"></div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <TextLogo className="text-5xl sm:text-[5rem]" />
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
        <Footer layout={false} bg={false} />
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      {sessionData && (
        <Link href="/confessions">
          <Button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            Confessions
          </Button>
        </Link>
      )}
      <Button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={
          sessionData ? () => void signOut() : () => void signIn("google")
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
