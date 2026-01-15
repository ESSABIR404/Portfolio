import { Suspense } from "react";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import ErrorBoundary from "./ErrorBoundary";

const SuspenseFallback = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[160px] flex items-center justify-center text-sm text-neutral-300"
  >
    {message}
  </div>
);

/**
 * Standard page layout wrapper with navbar, content, and footer.
 * Handles error boundaries and suspense fallbacks for consistency.
 */
export const PageLayout = ({
  children,
  fallbackMessage = "Failed to load — please refresh.",
  loadingMessage = "Loading…",
}) => (
  <div className="w-full max-w-full">
    <Navbar />
    <ErrorBoundary fallback={<SuspenseFallback message={fallbackMessage} />}>
      <Suspense fallback={<SuspenseFallback message={loadingMessage} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
    <Footer />
  </div>
);

/**
 * Error page layout for 404 or other errors.
 */
export const ErrorPageLayout = ({ title, message }) => (
  <div className="w-full max-w-full">
    <Navbar />
    <main className="home-surface c-space section-spacing">
      <h1 className="text-heading">{title}</h1>
      <p className="font-normal text-neutral-400">{message}</p>
    </main>
    <Footer />
  </div>
);
