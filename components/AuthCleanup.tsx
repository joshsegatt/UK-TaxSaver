"use client";

import { useEffect } from "react";

export function AuthCleanup() {
  useEffect(() => {
    const nuke = (el: HTMLElement) => {
      // Apply inline styles to force hide immediately
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("width", "0", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("position", "absolute", "important");
      el.style.setProperty("pointer-events", "none", "important");

      // Then remove from DOM
      try {
        el.remove();
      } catch (e) {
        // Ignore if already removed
      }
    };

    const checkAndNuke = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      const el = node as HTMLElement;

      // 1. LastPass / Extension Specific Checks
      const id = el.id.toLowerCase();
      const className = el.className.toString().toLowerCase();

      if (id.includes("lastpass") ||
        className.includes("lastpass") ||
        el.dataset.lastpassRoot !== undefined ||
        el.getAttribute("data-lastpass-icon-root") !== null) {
        nuke(el);
        return;
      }

      // 2. "Last" Text / Alt Attribute Check
      // Use textContent for performance, trim whitespace
      const text = (el.textContent || "").trim();
      const alt = el.getAttribute("alt");
      const title = el.getAttribute("title");

      // Check Alt/Title
      if (alt === "Last" || alt === "last" || title === "Last" || title === "last") {
        nuke(el);
        return;
      }

      // Check Text Content (Strict to avoid killing "Last Name")
      if (text === "Last" || text === "last") {
        // Safety: Ensure it's not a label or inside a label
        if (el.tagName !== "LABEL" && !el.closest("label")) {
          nuke(el);
          return;
        }
      }

      // 3. Button Children Whitelist (Google/GitHub)
      // If this element is inside an Auth button, we are very strict
      const btn = el.closest('button[data-provider], button[aria-label*="Google"], button[aria-label*="GitHub"]');
      if (btn) {
        const tag = el.tagName;
        const src = el.getAttribute("src") || "";

        // Allow SVGs (Icons)
        if (tag === "SVG" || el.closest("svg")) return;

        // Allow Valid Images (Google/GitHub logos)
        if (tag === "IMG" && (src.includes("google") || src.includes("github") || src.includes("gstatic"))) return;

        // Allow Valid Text (Sign in, Continue, Provider Name)
        if ((tag === "SPAN" || tag === "DIV") &&
          (text.includes("Sign") || text.includes("Google") || text.includes("GitHub") || text.includes("Continue"))) {
          return;
        }

        // If it's not whitelisted, it's garbage.
        nuke(el);
      }
    };

    // --- EXECUTION ---

    // 1. Initial Sweep
    document.querySelectorAll('*').forEach(n => checkAndNuke(n));

    // 2. Mutation Observer (Instant Reaction)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(n => {
          checkAndNuke(n);
          if (n instanceof HTMLElement) {
            n.querySelectorAll('*').forEach(c => checkAndNuke(c));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["alt", "class", "id", "style"]
    });

    // 3. Interval Fallback (Redundancy for missed mutations)
    const interval = setInterval(() => {
      // Only scan buttons and potential garbage containers to save performance
      const targets = document.querySelectorAll('button[data-provider] *, [id*="last"], [class*="last"], [alt="Last"]');
      targets.forEach(n => checkAndNuke(n));
    }, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}
