interface Props {
  layout?: boolean;
  bg?: boolean;
}

export default function Footer({ layout = true, bg = true }: Props) {
  return (
    <footer
      className={
        `bottom-0 mb-10 mt-10 flex w-full items-center justify-center text-center text-sm font-light` +
        (!layout ? " absolute" : "") +
        (bg ? " light:bg-white text-gray-400" : " text-white")
      }
    >
      &copy; 2023 Unlied. Created with 🗿 by
      <a className="ml-1" href="https://brilian.me/">
        Briel.
      </a>
    </footer>
  );
}
