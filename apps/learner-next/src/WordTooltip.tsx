import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./word-tooltip.css";

export function WordTooltip({ label, romaji, meaning, className, children, onClick }: {
  label: string; romaji: string; meaning: string; className?: string; children: ReactNode; onClick: () => void;
}) {
  const id = useId(), button = useRef<HTMLButtonElement>(null), tooltip = useRef<HTMLDivElement>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout>>();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const keepOpen = () => { clearTimeout(dismissTimer.current); setOpen(true); };
  const close = () => { clearTimeout(dismissTimer.current); setOpen(false); };
  const leave = () => { dismissTimer.current = setTimeout(() => setOpen(false), 140); };

  useLayoutEffect(() => {
    if (!open || !button.current || !tooltip.current) return;
    const anchor = button.current.getBoundingClientRect(), box = tooltip.current.getBoundingClientRect();
    const left = Math.max(12, Math.min(anchor.left + anchor.width / 2 - box.width / 2, window.innerWidth - box.width - 12));
    const top = anchor.top >= box.height + 20 ? anchor.top - box.height - 8 : anchor.bottom + 8;
    setPosition({ left, top: Math.max(12, Math.min(top, window.innerHeight - box.height - 12)) });
  }, [open, romaji, meaning]);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => setOpen(false);
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); dismiss(); }
    };
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    document.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      document.removeEventListener("keydown", key, true);
    };
  }, [open]);
  useEffect(() => () => clearTimeout(dismissTimer.current), []);

  return <>
    <button ref={button} type="button" className={className} aria-label={label} aria-describedby={open ? id : undefined}
      onMouseEnter={keepOpen} onMouseLeave={leave} onFocus={keepOpen} onBlur={close}
      onClick={() => { keepOpen(); onClick(); }}>{children}</button>
    {open && createPortal(<div ref={tooltip} id={id} role="tooltip" lang="en" className="word-tooltip" style={position}
      onMouseEnter={keepOpen} onMouseLeave={leave}>
      <strong>{romaji}</strong><span>{meaning}</span>
    </div>, document.body)}
  </>;
}
