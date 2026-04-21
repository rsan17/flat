"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  trackCtaClick,
  trackOutboundClick,
  type CtaLocation,
  type OutboundTarget,
} from "@/lib/analytics";

type Props =
  | {
      event: "cta_click";
      location: CtaLocation;
      href: string;
      className?: string;
      children: ReactNode;
    }
  | {
      event: "outbound_click";
      target: OutboundTarget;
      external?: boolean;
      href: string;
      className?: string;
      children: ReactNode;
    };

export function TrackedLink(props: Props) {
  const handleClick = () => {
    if (props.event === "cta_click") {
      trackCtaClick(props.location);
    } else {
      trackOutboundClick(props.target);
    }
  };

  if (props.event === "outbound_click" && props.external) {
    return (
      <a
        href={props.href}
        className={props.className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {props.children}
      </a>
    );
  }

  return (
    <Link href={props.href} className={props.className} onClick={handleClick}>
      {props.children}
    </Link>
  );
}
