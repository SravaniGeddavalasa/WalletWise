import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border/60 rounded-2xl bg-background/30 backdrop-blur-sm min-h-[300px] select-none">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
        {icon || <FolderOpen className="h-7 w-7" />}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
