import Image from "next/image";
import { jarSrc } from "@/lib/jars";

export default function CartThumb({ slug, className = "h-20 w-16" }: { slug: string; className?: string }) {
  return (
    <div className={`relative shrink-0 rounded-xl bg-honey/40 ${className}`}>
      <Image src={jarSrc(slug)} alt="" fill sizes="80px" className="object-contain p-1" />
    </div>
  );
}
