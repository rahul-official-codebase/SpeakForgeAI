import { SignIn } from "@clerk/nextjs";
import Navbar from "../../components/Navbar";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="sf-main">
        <div className="sf-auth-card">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p className="sf-eyebrow">Welcome back</p>
            <h1 style={{ fontSize: 28, marginTop: 8 }}>Log in to SpeakForgeAI</h1>
          </div>
          <SignIn
            routing="hash"
            signUpUrl="/register"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                card: { boxShadow: "none", border: "1px solid rgba(0,103,75,0.18)" },
                formButtonPrimary: {
                  backgroundColor: "#00674b",
                  "&:hover": { backgroundColor: "#0a7d5c" },
                },
              },
            }}
          />
        </div>
      </main>
    </>
  );
}
