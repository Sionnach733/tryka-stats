"use client";

import { useState, useTransition } from "react";
import { claimAthleteAction } from "@/app/athletes/actions";

export default function ClaimButton({ slug, name }: { slug: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const res = await claimAthleteAction(slug);
            if (!res.ok) setError(res.error);
          })
        }
        className="rounded-md bg-tryka-green px-3 py-1.5 text-sm font-medium text-tryka-navy hover:bg-tryka-green/90 disabled:opacity-50"
      >
        {pending ? "Claiming…" : `I'm ${name} — claim profile`}
      </button>
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
    </div>
  );
}
