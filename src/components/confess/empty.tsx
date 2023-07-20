import { Player } from "@lottiefiles/react-lottie-player";

export default function Empty() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 px-4 sm:px-0">
      <h1 className="font-semibold">
        Theres no confessions for you. Share ur link and get some confession.
      </h1>
      <Player
        src="https://lottie.host/94e0281f-6014-483c-a041-f402832c42b0/0gO3x3oVDH.json"
        autoplay
        loop
        className="w-72"
      />
    </div>
  );
}
