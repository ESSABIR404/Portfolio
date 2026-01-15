const Alert = ({ type, text, isVisible }) => {
  return (
    <div
      className={`fixed z-50 flex items-center justify-center bottom-5 right-5 transition-all duration-300 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-95 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      <div
        className={`p-2 ${
          type === "danger" ? "bg-red-800" : "bg-royal"
        } items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex rounded-md p-5`}
      >
        <p
          className={`flex rounded-full ${
            type === "danger" ? "bg-red-500" : "bg-lavender"
          } uppercase px-2 py-1 text-xs font-semibold mr-3`}
        >
          {type === "danger" ? "Failed" : "Success"}
        </p>
        <p className="mr-2 text-left">{text}</p>
      </div>
    </div>
  );
};

export default Alert;
