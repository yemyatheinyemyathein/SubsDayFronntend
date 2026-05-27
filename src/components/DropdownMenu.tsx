import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu components must be used within <DropdownMenu>');
  return ctx;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'end';
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, className }) => {
  const { open, setOpen } = useDropdownMenu();

  return (
    <div className={className} onClick={() => setOpen(!open)}>
      {children}
    </div>
  );
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'end',
}) => {
  const { open, setOpen } = useDropdownMenu();

  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute right-0 z-50 mt-2 min-w-[12rem] overflow-hidden rounded-lg border bg-card shadow-lg',
        align === 'start' && 'left-0 right-auto'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick, className }) => {
  const { setOpen } = useDropdownMenu();

  return (
    <button
      className={cn(
        'flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors',
        className
      )}
      onClick={() => {
        setOpen(false);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
};
