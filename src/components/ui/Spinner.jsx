export function Spinner({ size = 16, color = "var(--color-accent)", className = "" }) {
    return (
      <div
        className={`rounded-full animate-spin ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${size / 8}px`,
          borderColor: `${color} transparent ${color} transparent`,
          borderStyle: "solid",
        }}
      />
    );
  }
  