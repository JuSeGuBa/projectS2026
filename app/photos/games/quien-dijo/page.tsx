"use client";
import dynamic from "next/dynamic";
const QuienDijo = dynamic(() => import("@/components/QuienDijo"), {
  ssr: false,
});
export default function QuienDijoPage() {
  return <QuienDijo />;
}
