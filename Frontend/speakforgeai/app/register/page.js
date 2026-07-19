import { SignUp } from "@clerk/nextjs";
import Navbar from "../../components/Navbar";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="sf-main">
        <div className="sf-auth-card">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p className="sf-eyebrow">Get started</p>
            <h1 style={{ fontSize: 28, marginTop: 8 }}>
              Create your SpeakForgeAI account
            </h1>
          </div>
          <SignUp
            routing="hash"
            signInUrl="/login"
            afterSignUpUrl="/dashboard"
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
