export function Label({ htmlFor, className = "", children }) {
    return (
      <label htmlFor={htmlFor} className={`text-sm text-text ${className}`}>
        {children}
      </label>
    );
  }
  