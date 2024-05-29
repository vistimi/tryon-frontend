import { title } from "@/components/global/primitives";
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="text-center justify-center flex flex-col gap-4 py-8 md:py-10">
            <p className={title()}>Not Found</p>
            <p>Could not find requested resource</p>
            <Link href="/">Return Home</Link>
        </div>
  );
};
