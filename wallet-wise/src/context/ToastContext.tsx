import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = getToastConfig(toast.type);
            const Icon = config.icon;
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md pointer-events-auto ${config.classes}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-sm font-medium pr-2 break-words">
                  {toast.message}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-auto text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle2,
        classes: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/20",
      };
    case "error":
      return {
        icon: AlertCircle,
        classes: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 dark:bg-rose-950/20",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        classes: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 dark:bg-amber-950/20",
      };
    case "info":
    default:
      return {
        icon: Info,
        classes: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 dark:bg-blue-950/20",
      };
  }
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
