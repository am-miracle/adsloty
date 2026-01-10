import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/adsloty.png"
      alt="Adsloty logo"
      width={160}
      height={40}
      priority
      className="h-10 w-auto object-contain"
    />
  );
};

export default Logo;
