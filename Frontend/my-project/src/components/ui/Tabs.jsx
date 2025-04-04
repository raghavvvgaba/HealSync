export function Tabs({ value, onValueChange, children, className = "" }) {
    return <div className={className}>{children(onValueChange)}</div>;
  }
  
  export function TabsList({ children, className = "" }) {
    return <div className={`flex bg-secondary rounded-md ${className}`}>{children}</div>;
  }
  
  export function TabsTrigger({ value, selectedValue, onClick, children }) {
    const isActive = value === selectedValue;
  
    return (
      <button
        type="button"
        onClick={() => onClick(value)}
        className={`w-full py-2 px-4 text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-background"
            : "bg-secondary text-text hover:bg-accent hover:text-background"
        }`}
      >
        {children}
      </button>
    );
  }
  