import { cn } from "@/lib/utils";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export default function CategoryIcon({ icon, className }: CategoryIconProps) {
  if (icon.startsWith('http') || icon.startsWith('/') || icon.endsWith('.svg')) {
    return <img src={icon} alt="Category" className={cn("inline-block object-contain drop-shadow-sm", className)} />;
  }
  return <span className={className}>{icon}</span>;
}
