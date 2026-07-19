"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/session", label: "New session" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: "1px solid rgba(0, 103, 75, 0.18)",
        background: "#fffdf4",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "#00674b",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span aria-hidden="true">🔨</span> SpeakForgeAI
        </Link>

        <SignedIn>
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: active ? "#00674b" : "#3d4b45",
                    borderBottom: active
                      ? "2px solid #00674b"
                      : "2px solid transparent",
                    paddingBottom: 4,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <UserButton afterSignOutUrl="/" />
          </nav>
        </SignedIn>

        <SignedOut>
          <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/login" className="sf-btn sf-btn-outline">
              Log in
            </Link>
            <Link href="/register" className="sf-btn">
              Sign up free
            </Link>
          </nav>
        </SignedOut>
      </div>
    </header>
  );
}
