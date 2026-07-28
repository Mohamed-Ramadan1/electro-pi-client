import { Suspense } from "react";
import AuthPageContent from "./auth-content";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
