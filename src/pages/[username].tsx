import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import ErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Footer from "~/components/footer/footer";
import TextLogo from "~/components/text-logo";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { api } from "~/utils/api";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;

  const maxHeight = window.innerHeight / 3;
  textArea.style.height = "0";

  if (textArea.scrollHeight < maxHeight) {
    textArea.style.height = `${textArea.scrollHeight}px`;
  } else {
    textArea.style.height = `${maxHeight}px`;
  }
}

const variants = {
  open: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    delay: 1,
    transition: {
      duration: 0.5,
    },
  },
  closed: {
    opacity: 0,
    rotate: 30,
    scale: 0,
    delay: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ConfessPage() {
  const session = useSession();
  const router = useRouter();
  const usernameQuery = router.query.username as string;
  const username = usernameQuery ? usernameQuery.replace("@", "") : "";
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [sendAsAnon, setSendAsAnon] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const { data: userData, isLoading } = api.confess.getUser.useQuery({
    username: username,
  });

  const [messageValue, setMessageValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [messageValue]);

  const createConfess = api.confess.create.useMutation({
    onSuccess: () => {
      setIsSubmit(true);
      setMessageValue("");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (messageValue.trim().length === 0) {
      setError("Message is required");
      return;
    }

    createConfess.mutate({
      message: messageValue,
      sendAsAnon,
      user: username,
    });
  };

  if (isLoading) {
    return <h1>Loading ...</h1>;
  }

  if (userData == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>Unlied - @{username}</title>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <div className="min-w-screen flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#B993D6] to-[#8CA6DB]">
        <TextLogo className="absolute top-0 mt-10" />

        <motion.div
          initial="closed"
          animate={isSubmit ? "closed" : "open"}
          variants={variants}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="absolute z-20 flex flex-col"
        >
          <Card className="md:w-[720px]">
            <CardHeader className="flex items-center justify-center sm:flex-row sm:justify-start">
              {userData.image && userData.name && (
                <>
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userData.image} alt={userData.name} />
                  </Avatar>
                  <span className="text-sm font-light text-gray-500 sm:hidden">
                    @{username}
                  </span>
                </>
              )}
              <CardTitle className="ml-4 flex select-none flex-col justify-center text-center">
                {username === session.data?.user.username ? (
                  <div className="items-start">
                    <span>
                      Tell something
                      <span className="bg-gradient-to-br from-pink-400 to-red-600 bg-clip-text text-sm text-transparent">
                        (truth)
                      </span>
                    </span>
                    <span>to yourself?!</span>
                  </div>
                ) : (
                  <div className="items-start">
                    <span>
                      Tell something
                      <span className="bg-gradient-to-br from-pink-400 to-red-600 bg-clip-text text-sm text-transparent">
                        (truth)
                      </span>
                    </span>
                    <span>to {userData.name}</span>
                  </div>
                )}
                <span className="hidden text-left text-base font-light text-gray-500 sm:inline">
                  @{username}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <textarea
                    className="sm:text-md min-h-[70px] w-full resize-none rounded-md border-0 text-sm outline-none placeholder:text-muted-foreground sm:min-h-[100px]"
                    placeholder="Type your message here.."
                    ref={inputRef}
                    style={{ height: 0 }}
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    maxLength={400}
                  />
                  <div className="mt-4 flex justify-between">
                    <div className="flex items-center space-x-4">
                      {session.status === "authenticated" && (
                        <>
                          <Label
                            htmlFor="sendAsAnonId"
                            className="sm:text-md text-xs"
                          >
                            Send as anonymous?
                          </Label>
                          <Switch
                            id="sendAsAnonId"
                            placeholder="Send as anonymous?"
                            checked={sendAsAnon}
                            onCheckedChange={() => setSendAsAnon(!sendAsAnon)}
                            className=""
                          />
                        </>
                      )}
                    </div>
                    <span className="text-right text-sm text-gray-400">
                      {400 - messageValue.trim().length < 100 &&
                        400 - messageValue.trim().length}
                    </span>
                  </div>
                </div>
                {isLoading ? (
                  <Button className="disabled:cursor-not-allowed" disabled>
                    Sending...
                  </Button>
                ) : (
                  <Button
                    className="disabled:cursor-not-allowed"
                    disabled={messageValue.trim().length < 1}
                  >
                    Send
                  </Button>
                )}
              </form>
              {session.status === "authenticated" ? (
                <p className="mt-4 text-center text-xs font-light text-slate-500 sm:text-sm">
                  You logged in as{" "}
                  {session.data.user.name || session.data.user.email}.{" "}
                  <span
                    className="font-normal hover:cursor-pointer"
                    onClick={() => void signOut()}
                  >
                    Logout instead?
                  </span>
                </p>
              ) : (
                <p className="mt-4 text-center text-sm font-light text-slate-500">
                  You will send as anonymous.
                  <span
                    className="ml-1 font-normal hover:cursor-pointer"
                    onClick={() => void signIn("google")}
                  >
                    Sign in instead?
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Success */}
        <motion.div
          initial="closed"
          animate={isSubmit ? "open" : "closed"}
          variants={variants}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Card className="md:w-[720px]">
            <CardHeader>
              <CardTitle className="flex select-none flex-col items-center sm:flex-row">
                {userData.image && userData.name && (
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userData.image} alt={userData.name} />
                  </Avatar>
                )}
                <span className="ml-4 mt-4 text-center sm:mt-0 sm:text-start">
                  Your confess has been sent to {userData.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsSubmit(false)} className="w-full">
                Send message again?
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <Footer layout={false} bg={false} />
      </div>
    </>
  );
}
