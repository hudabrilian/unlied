import Head from "next/head";
import InfiniteConfessList from "~/components/confess/infinite-confess-list";
import Layout from "~/components/layouts/layout";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";

export default function Confessions() {
  return (
    <Layout>
      <Head>
        <title>Confessions</title>
      </Head>
      <main>
        <div className="flex h-full flex-1 flex-col space-y-8 pt-4 sm:px-8">
          <div className="px-4 sm:px-0">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of other confessions for you!
            </p>
          </div>
          <Separator />
          <RecentConfessions />
        </div>
      </main>
    </Layout>
  );
}

function RecentConfessions() {
  const confessions = api.confess.getInfinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <InfiniteConfessList
      confessions={confessions.data?.pages.flatMap((page) => page.confessions)}
      isError={confessions.isError}
      isLoading={confessions.isLoading}
      hasMore={confessions.hasNextPage}
      fetchNewConfessions={confessions.fetchNextPage}
    />
  );
}
