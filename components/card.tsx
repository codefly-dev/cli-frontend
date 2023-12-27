import clsx from "clsx";
import { PropsWithChildren } from "react";

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "w-full h-full rounded-xl border border-neutral-100 bg-white shadow-sm p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
