import copy from "copy-to-clipboard";
import QRCodeStyling, {
  type CornerDotType,
  type CornerSquareType,
  type DotType,
  type DrawType,
  type ErrorCorrectionLevel,
  type Mode,
  type Options,
  type TypeNumber,
} from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props {
  size: {
    width: number;
    height: number;
  };
  username: string;
  link: string;
}

export default function QRCodeShare({ username, link, size }: Props) {
  const [options] = useState<Options>({
    width: size.width,
    height: size.height,
    type: "svg" as DrawType,
    data: link,
    image: "/text-logo-2.png",
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte" as Mode,
      errorCorrectionLevel: "Q" as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.6,
      margin: 5,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      color: "#222222",
      type: "extra-rounded" as DotType,
    },
    backgroundOptions: {
      //   color: "#5FD4F3",
    },
    cornersSquareOptions: {
      color: "#222222",
      type: "extra-rounded" as CornerSquareType,
    },
    cornersDotOptions: {
      color: "#222222",
      type: "dot" as CornerDotType,
    },
  });
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  const onCopyClick = () => {
    copy(link);
  };

  const onDownloadClick = async () => {
    if (!qrCode) return;
    await qrCode.download({
      name: `Unlied @${username}`,
      extension: "png",
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {!qrCode ? (
        <p className="animate-pulse">Generating QR Code</p>
      ) : (
        <div ref={ref}></div>
      )}
      <div className="my-4 text-center">
        <h1 className="text-lg font-semibold">@{username}</h1>
        <span className="text-sm text-gray-400">
          Change username in the settings page
        </span>
      </div>
      <div className="flex space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button onClick={onCopyClick}>Copy link</Button>
          </PopoverTrigger>
          <PopoverContent>Copied!</PopoverContent>
        </Popover>
        <Button onClick={() => void onDownloadClick()}>Download</Button>
        {/* <Button onClick={onShareClick}>Share</Button> */}
      </div>
    </div>
  );
}
