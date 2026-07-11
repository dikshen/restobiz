import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative px-4">
      <Search className="pointer-events-none absolute left-8 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for dishes..."
        className="pl-10 pr-10"
        aria-label="Search menu"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-faint hover:bg-black/5"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
