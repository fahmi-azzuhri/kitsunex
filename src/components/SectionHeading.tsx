import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type SectionHeadingProps = {
  icon: ReactNode;
  title: string;
  action: string;
  onClick?: () => void;
  rightContent?: ReactNode;
};

export function SectionHeading({
  icon,
  title,
  action,
  onClick,
  rightContent,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <span className="heading-icon">{icon}</span>
        <h2>{title}</h2>
      </div>
      {rightContent || (
        <button onClick={onClick}>
          {action} <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
