import { cn } from "@/lib/utils";

type HamburgerButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  label?: string;
};

export default function HamburgerButton({
  isOpen,
  onClick,
  className,
  label = "Toggle mobile menu",
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
      className={cn("hamburger-toggle", isOpen && "is-clicked", className)}
    >
      <span aria-hidden="true" />
    </button>
  );
}
