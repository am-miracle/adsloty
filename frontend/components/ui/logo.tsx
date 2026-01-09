import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src={"/adsloty.png"}
      alt="adsloty logo"
      width={100}
      height={100}
      className="w-full h-full object-cover"
    />
  );
};

export default Logo;
