"use client";
import dynamic from "next/dynamic";
const TestRecuerdos = dynamic(() => import("@/components/TestRecuerdos"), {
  ssr: false,
});
export default function RecuerdosPage() {
  return <TestRecuerdos />;
}
