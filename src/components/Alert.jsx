/**
 * Toast alert component for success/error feedback.
 * Renders with smooth fade and scale transitions.
 *
 * Props:
 * - type: "danger" | "success"
 * - text: Message to display
 * - isVisible: Whether alert is shown
 */
const Alert = ({ type, text, isVisible }) => {
  const isDanger = type === "danger";
  const visibilityClasses = isVisible
    ? "opacity-100 translate-y-0 scale-100"
    : "opacity-0 translate-y-6 scale-95 pointer-events-none";

  return (
    <div
      className={`fixed z-50 flex items-center justify-center bottom-5 right-5 transition-all duration-300 ease-in-out ${visibilityClasses}`}
      role="status"
      aria-live="polite"
      aria-hidden={!isVisible}
    >
      <div
        className={`flex items-center leading-none rounded-md lg:rounded-full p-5 ${
          isDanger ? "bg-red-800" : "bg-royal"
        }`}
      >
        <p
          className={`flex rounded-full uppercase px-2 py-1 text-xs font-semibold mr-3 ${
            isDanger ? "bg-red-500" : "bg-lavender"
          } text-indigo-100`}
        >
          {isDanger ? "Failed" : "Success"}
        </p>
        <p className="mr-2 text-left text-indigo-100">{text}</p>
      </div>
    </div>
  );
};

export default Alert;
