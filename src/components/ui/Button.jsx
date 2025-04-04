export function Button({ children, type = "button", className = "", variant = "default", ...props }) {
    const base =
      "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
    const variants = {
      default: "bg-primary text-background hover:bg-accent focus:ring-primary",
      outline:
        "bg-background text-primary border border-primary hover:bg-primary hover:text-background focus:ring-accent",
    };
  
    return (
      <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
  