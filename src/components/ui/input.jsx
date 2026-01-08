import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  error,
  ...props
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] selection:bg-blue-800",
          "bg-[#0F0D0D] border-none text-white placeholder:text-light focus:border-yellow h-12",
          error && "border border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export { Input }
