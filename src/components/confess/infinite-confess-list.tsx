import moment from "moment";
import { motion } from "framer-motion";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import ProfileSkeleton from "../skeleton/profile-skeleton";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Empty from "./empty";
import ReactMarkdown from "react-markdown";

type Confess = {
  id: string;
  message: string;
  author: {
    name: string;
    username: string;
    image: string | null;
  };
  createdAt: Date;
};

type InfiniteConfessListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewConfessions: () => Promise<unknown>;
  confessions?: Confess[];
};

export default function InfiniteConfessList({
  confessions,
  isError,
  isLoading,
  fetchNewConfessions,
  hasMore = false,
}: InfiniteConfessListProps) {
  if (isLoading) return <ProfileSkeleton />;
  if (isError) return <p>Error</p>;

  if (confessions == null || confessions.length === 0) {
    return <Empty />;
  }

  return (
    <InfiniteScroll
      dataLength={confessions.length}
      next={fetchNewConfessions}
      hasMore={hasMore}
      loader={<ProfileSkeleton />}
      // className="gap-8 space-y-8 md:columns-2 lg:columns-3"
    >
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="10px">
          {confessions.map((confess) => (
            <motion.div
              key={confess.id}
              className="break-inside-avoid-column"
              initial={{
                opacity: 0,
                scale: 0.6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                type: "spring",
                duration: 0.5,
              }}
            >
              <Card className="overflow-auto">
                <CardHeader className="flex flex-row items-center space-x-4">
                  {confess.author &&
                    confess.author.image &&
                    confess.author.name && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={confess.author.image}
                          alt={confess.author.name}
                        />
                      </Avatar>
                    )}
                  <CardTitle>
                    {confess.author?.name ? (
                      confess.author.username ? (
                        <Link href={`@${confess.author.username}`}>
                          {confess.author.name || `@${confess.author.username}`}
                        </Link>
                      ) : (
                        <p>{confess.author.name}</p>
                      )
                    ) : (
                      <p>Anonymous</p>
                    )}
                    <p className="text-sm font-thin text-gray-400">
                      {moment(confess.createdAt).fromNow()}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-auto whitespace-break-spaces break-all">
                  <ReactMarkdown>{confess.message}</ReactMarkdown>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </InfiniteScroll>
  );
}
