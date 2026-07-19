import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

export const metadata = {
  title: "SpeakForgeAI — Forge your speaking skills",
  description:
    "Practice speaking on the fly, get AI evaluation on your delivery, and track your progress over time.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00674b",
          colorBackground: "#f6f4e8",
          colorText: "#003f2d",
          borderRadius: "4px",
        },
      }}
    >
      <html lang="en">
        <body>
          <div className="sf-shell">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
