import React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";

export function Tabs({ className, children, ...props }: RadixTabs.TabsProps) {
  return (
    <RadixTabs.Root
      className={clsx("flex flex-col w-full", className)}
      {...props}
    >
      {children}
    </RadixTabs.Root>
  );
}

export function TabList({
  className,
  children,
  ...props
}: RadixTabs.TabsListProps) {
  return (
    <RadixTabs.List
      className={clsx("flex gap-4 border-b border-neutral-100", className)}
      aria-label="Manage your account"
      {...props}
    >
      {children}
    </RadixTabs.List>
  );
}

export function Tab({
  className,
  children,
  ...props
}: RadixTabs.TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      className={clsx(
        "text-black h-[45px] w-auto flex items-center justify-center text-[15px] leading-none select-none data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-default",
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

export function TabContent({
  className,
  children,
  ...props
}: RadixTabs.TabsContentProps) {
  return (
    <RadixTabs.Content
      className={clsx("growoutline-none", className)}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  );
}
