import React from "react";

/**
 * Utility to merge tailwind classes safely
 */
export function cx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Logo: the VaultX dial mark, with or without the wordmark
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="12.5" fill="none" stroke="#7c5cff" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="8" fill="none" stroke="#7c5cff" strokeOpacity="0.45" />
        <path d="M14 4.5v4M14 19.5v4M4.5 14h4M19.5 14h4" stroke="#7c5cff" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2" fill="#7c5cff" />
      </svg>
      {!compact && <span className="text-[17px] font-semibold tracking-tight">VaultX</span>}
    </span>
  );
}

/**
 * PageHeader: Used at the top of every major view
 */
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2 tracking-wide">{title}</h1>
      {description && <p className="text-dim text-sm">{description}</p>}
    </div>
  );
}

/**
 * Panel: The standard card container for grouping content
 */
export function Panel({ 
  title, 
  aside, 
  children, 
  className,
  bodyClassName
}: { 
  title?: string; 
  aside?: React.ReactNode; 
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cx("bg-panel border border-line rounded-[16px] overflow-hidden", className)}>
      {(title || aside) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          {title && <h3 className="font-semibold text-lg text-ink">{title}</h3>}
          {aside && <div>{aside}</div>}
        </div>
      )}
      <div className={cx(title || aside ? "p-6" : "p-0", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}

/**
 * Button: Standardized buttons with primary and secondary variants
 */
export function Button({ 
  children, 
  variant = "primary", 
  className, 
  onClick, 
  type = "button",
  disabled 
}: { 
  children: React.ReactNode; 
  variant?: "primary" | "secondary"; 
  className?: string; 
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-[10px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent hover:bg-accent/90 text-white px-5 py-2.5",
    secondary: "bg-transparent border border-line text-ink hover:border-accent hover:text-accent px-5 py-2.5"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={cx(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
}

/**
 * Badge: Small status indicators (Pending, Completed, High Risk, etc.)
 */
export function Badge({ 
  children, 
  tone = "neutral",
  className
}: { 
  children: React.ReactNode; 
  tone?: "neutral" | "up" | "down" | "accent";
  className?: string;
}) {
  const tones = {
    neutral: "bg-void border border-line text-dim",
    up: "bg-up/10 text-up border border-up/20",
    down: "bg-down/10 text-down border border-down/20",
    accent: "bg-accent/10 text-accent border border-accent/20"
  };

  return (
    <span className={cx("px-2.5 py-1 rounded-[6px] text-[11px] font-bold tracking-wide uppercase", tones[tone], className)}>
      {children}
    </span>
  );
}

/**
 * Field: Reusable input field with a label
 */
export function Field({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  defaultValue 
}: { 
  id: string; 
  label: string; 
  type?: string; 
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-dim mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-[10px] border border-line bg-void px-4 py-3 text-sm text-ink outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
/**
 * Toggle: A sleek dark-themed switch
 */
export function Toggle({ 
  checked, 
  onChange 
}: { 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cx(
        "w-11 h-6 rounded-full transition-colors relative shrink-0",
        checked ? "bg-accent" : "bg-line"
      )}
    >
      <span className={cx(
        "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  );
}
/**
 * Stat: A compact dark-themed card for displaying key metrics and numbers
 */
export function Stat({ 
  label, 
  title,
  value, 
  children,
  className
}: { 
  label?: string;
  title?: string; 
  value?: string | number | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("bg-panel border border-line rounded-[16px] p-5 flex flex-col", className)}>
      {(label || title) && (
        <p className="text-sm font-medium text-dim mb-2">{label || title}</p>
      )}
      {value !== undefined && (
        <h2 className="text-3xl font-semibold text-ink">{value}</h2>
      )}
      {children}
    </div>
  );
}