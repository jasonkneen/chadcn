"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@chadcn/upstream-shadcn/popover";
export function UsagePopover({ seconds, tokens, percent = 73 }: {
    seconds: number;
    tokens: number;
    percent?: number;
}) {
    const usage = Math.min(100, Math.max(0, percent));
    return <Popover><PopoverTrigger asChild><button className="studio-usage-trigger" aria-label={`${seconds}s, ${tokens} tokens used — show usage limits`}><span>{seconds}s</span><span className="studio-separator">·</span><span>{tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : tokens} tokens</span></button></PopoverTrigger><PopoverContent className="studio-popover studio-usage" side="top"><div><span>Your usage limits</span><strong>{usage}%</strong></div><div className="studio-meter" role="meter" aria-label="Usage" aria-valuenow={usage} aria-valuemin={0} aria-valuemax={100}>{Array.from({ length: 37 }, (_, i) => <span key={i} data-on={i < Math.round(usage * .37)} style={{ animationDelay: `${i * 12}ms` }}/>)}</div><p>Resets in 2 hr 21 min</p></PopoverContent></Popover>;
}
