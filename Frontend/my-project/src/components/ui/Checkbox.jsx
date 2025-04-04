export function Checkbox({ id, className = "", ...props }) {
    return (
      <input
        type="checkbox"
        id={id}
        className={`h-4 w-4 text-accent bg-background border-secondary rounded focus:ring-primary ${className}`}
        {...props}
      />
    );
  }
  