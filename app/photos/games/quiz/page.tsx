"use client";
import dynamic from "next/dynamic";
const QuizConoces = dynamic(() => import("@/components/QuizConoces"), {
  ssr: false,
});
export default function QuizPage() {
  return <QuizConoces />;
}
