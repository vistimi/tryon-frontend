// 'use client'
// import {Image} from "@nextui-org/react";
import Image from "next/image";


export const Logo = () => {
  return (
    <Image
      // as={NextImage}
      src="/logo.webp"
      alt="logo"
      className="w-8 h-8"
      width={0}
      height={0}
      sizes="100vw"
      quality={5}
      priority={false}
    />
  )
}

export default Logo