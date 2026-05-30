"use client";

import { useRef, useState } from "react";

interface TimeInputProps {
  defaultValue: string;
  hasError: boolean;
}

function parseDefault(value: string): [string, string, string] {
  const parts = value.split(":");
  if (parts.length === 3) return [parts[0], parts[1], parts[2]];
  if (parts.length === 2) return ["", parts[0], parts[1]];
  return ["", "", ""];
}

const segmentClass = (hasError: boolean) =>
  `w-10 rounded border ${
    hasError ? "border-red-500/60" : "border-tryka-navy-light"
  } bg-tryka-navy px-2 py-2 text-center text-sm tabular-nums text-white placeholder:text-slate-500 focus:border-tryka-green focus:outline-none focus:ring-1 focus:ring-tryka-green`;

export function TimeInput({ defaultValue, hasError }: TimeInputProps) {
  const [init] = useState(() => parseDefault(defaultValue));
  const [h, setH] = useState(init[0]);
  const [m, setM] = useState(init[1]);
  const [s, setS] = useState(init[2]);

  const mRef = useRef<HTMLInputElement>(null);
  const sRef = useRef<HTMLInputElement>(null);

  const combined = h ? `${h}:${m}:${s}` : `${m}:${s}`;

  function handleH(raw: string) {
    const val = raw.replace(/\D/g, "").slice(0, 2);
    setH(val);
    if (val.length === 2) mRef.current?.focus();
  }

  function handleM(raw: string) {
    // If user types a colon, strip it and jump to seconds
    if (raw.includes(":")) {
      const val = raw.replace(/[^\d]/g, "").slice(0, 2);
      setM(val);
      sRef.current?.focus();
      return;
    }
    const val = raw.replace(/\D/g, "").slice(0, 2);
    setM(val);
    if (val.length === 2) sRef.current?.focus();
  }

  function handleS(raw: string) {
    const val = raw.replace(/\D/g, "").slice(0, 2);
    setS(val);
  }

  return (
    <span className="flex items-center gap-1">
      <input
        type="text"
        inputMode="numeric"
        placeholder="hh"
        maxLength={2}
        value={h}
        onChange={(e) => handleH(e.target.value)}
        aria-label="Hours (optional)"
        className={segmentClass(hasError)}
      />
      <span className="text-slate-400">:</span>
      <input
        ref={mRef}
        type="text"
        inputMode="numeric"
        placeholder="mm"
        maxLength={2}
        value={m}
        onChange={(e) => handleM(e.target.value)}
        aria-label="Minutes"
        aria-required="true"
        className={segmentClass(hasError)}
      />
      <span className="text-slate-400">:</span>
      <input
        ref={sRef}
        type="text"
        inputMode="numeric"
        placeholder="ss"
        maxLength={2}
        value={s}
        onChange={(e) => handleS(e.target.value)}
        aria-label="Seconds"
        aria-required="true"
        className={segmentClass(hasError)}
      />
      <input type="hidden" name="target" value={combined} />
    </span>
  );
}
