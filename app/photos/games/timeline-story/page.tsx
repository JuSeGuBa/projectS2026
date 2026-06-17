"use client";
import dynamic from "next/dynamic";
const TimelineStory = dynamic(() => import("@/components/TimelineStory"), { ssr: false });
export default function TimelineStoryPage() { return <TimelineStory />; }
