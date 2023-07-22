import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import { env } from "~/env.mjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";

const DynamicQRCodeShare = dynamic(() => import("./qrcode"), {
  ssr: false,
});

interface Props {
  size: {
    width: number;
    height: number;
  };
  username?: string | null | undefined;
  children?: ReactNode;
}

export default function DialogQrCode({ size, username, children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {username ? (
            <>
              <DialogTitle>Here your QR Code</DialogTitle>
              <DialogDescription>
                <span>Share to your friends. Make them confess to you!</span>
              </DialogDescription>
              <DynamicQRCodeShare
                size={size}
                username={username}
                link={`${env.NEXT_PUBLIC_BASE_URL}/@${username}`}
              />
            </>
          ) : (
            <div className="flex flex-col space-y-4">
              <p>Set your username first at settings page</p>
              <Link href="/settings">
                <Button>Settings Page</Button>
              </Link>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
