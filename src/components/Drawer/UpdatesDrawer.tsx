"use client";

import { motion, useAnimation, type PanInfo } from "framer-motion";
import { useState } from "react";
import { UpdateItem, type UpdateData } from "./UpdateItem";

interface UpdatesDrawerProps {
  updates: UpdateData[];
  loading?: boolean;
}

const COLLAPSED_HEIGHT = 198;
const EXPANDED_RATIO = 0.85;

export function UpdatesDrawer({ updates, loading }: UpdatesDrawerProps) {
  const [open, setOpen] = useState(false);
  const controls = useAnimation();

  function toggle() {
    setOpen((v) => !v);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const goingUp = info.offset.y < -40 || info.velocity.y < -200;
    const goingDown = info.offset.y > 40 || info.velocity.y > 200;
    if (goingUp) {
      setOpen(true);
    } else if (goingDown) {
      setOpen(false);
    } else {
      void controls.start(open ? "open" : "closed");
    }
  }

  return (
    <motion.aside
      aria-label="Latest updates"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.05}
      onDragEnd={handleDragEnd}
      animate={open ? "open" : "closed"}
      initial="closed"
      variants={{
        closed: { height: COLLAPSED_HEIGHT },
        open: { height: `${EXPANDED_RATIO * 100}vh` },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-hidden rounded-t-xl border-x border-t border-border bg-surface shadow-[var(--shadow-drawer)] lg:hidden"
      style={{ height: COLLAPSED_HEIGHT }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Collapse updates" : "Expand updates"}
        className="flex w-full flex-col items-stretch border-b border-border bg-surface px-4 py-2 text-left"
      >
        <span
          aria-hidden
          className="mx-auto h-1 w-10 rounded-full bg-border-strong"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-h3 font-semibold text-text-primary">
            Latest updates
          </span>
          <span className="text-meta text-text-tertiary">
            {open ? "Swipe ↓" : "Swipe ↑"}
          </span>
        </div>
      </button>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {loading ? (
          <div className="px-4 py-6 text-body-sm text-text-tertiary">
            Loading updates…
          </div>
        ) : updates.length === 0 ? (
          <div className="px-4 py-6 text-body-sm text-text-tertiary">
            No updates yet. Check back soon.
          </div>
        ) : (
          updates.map((u) => <UpdateItem key={u.id} update={u} />)
        )}
      </div>
    </motion.aside>
  );
}
