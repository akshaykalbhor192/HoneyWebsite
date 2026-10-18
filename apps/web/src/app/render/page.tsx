"use client";
// Dev utility: renders one jar on a transparent background so scripts can capture
// product cut-outs into /public/jars. Not linked from the site.
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const JarStage = dynamic(() => import("@/components/three/JarStage"), { ssr: false });

function Render() {
  const q = useSearchParams();
  const progress = { current: Number(q.get("r") ?? 0.06) };
  useEffect(() => {
    document.documentElement.dataset.render = "1";
  }, []);
  return (
    <div id="stage" className="fixed inset-0 z-[100]">
      <JarStage look={{ color: q.get("c") ?? "#e8a020", name: q.get("n") ?? "Raw Forest Honey", size: q.get("s") ?? "500 g" }} motion={{ progress }} idle={false} shadow={false} capture />
    </div>
  );
}

export default function RenderPage() {
  return (
    <Suspense>
      <Render />
    </Suspense>
  );
}
