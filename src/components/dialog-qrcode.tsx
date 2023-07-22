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
            <p>Set your username first</p>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
