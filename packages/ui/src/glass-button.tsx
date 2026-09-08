"use client";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@chadcn/upstream-shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@chadcn/upstream-shadcn/tooltip";
export function GlassButton({ label, children, className = "", ...props }: ComponentProps<typeof Button> & {
    label?: string;
    children: ReactNode;
}) {
    const button = <Button type="button" variant="ghost" size="icon-sm" className={`studio-icon ${className}`} aria-label={label} {...props}>{children}</Button>;
    return label ? <Tooltip><TooltipTrigger asChild>{button}</TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip> : button;
}
