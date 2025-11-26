import { SignIn } from "@stackframe/stack";
import { AuthCleanup } from "../../../components/AuthCleanup";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e] relative overflow-hidden">
      <AuthCleanup />
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-teal-500/10 blur-[150px] rounded-full border border-white/5 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[150px] rounded-full border border-white/5 pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-md p-4" data-lpignore="true">
        <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

          <div className="p-8 relative z-10">
            <SignIn fullPage={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
