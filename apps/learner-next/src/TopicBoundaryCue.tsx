import type { ActiveSession } from "./types";
import "./topic-boundary-cue.css";

export function isTopicBoundary(session: ActiveSession | undefined, index: number) {
  if (!session || (session.source !== "topic" && !(session.source === "vocabulary" && session.lessonPlan)) || index <= 0) return false;
  const transition = session.lessonPlan?.transitions?.[index];
  return transition ? transition.kind === "boundary" : session.items[index]?.reason === "New sentence pattern or phrase";
}

export function TopicBoundaryCue({ session, index, announce = false }: { session?: ActiveSession; index: number; announce?: boolean }) {
  if (!isTopicBoundary(session, index)) return null;
  return <span className="topic-boundary-cue" role={announce ? "status" : undefined} title="This step begins a different phrase or sentence pattern.">New pattern / phrase</span>;
}
