"use client";

import { useBookTransition } from "./BookTransition";

export function DetailPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOverlayVisible } = useBookTransition();

  // Show entrance animation only when overlay is fading out (page just loaded)
  // Don't show when closing (overlay handles that)
  return (
    <div className={isOverlayVisible ? "" : "detail-page-entered"}>
      {children}
    </div>
  );
}
