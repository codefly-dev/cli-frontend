import React, { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";

export function Dialog({
  trigger,
  children,
  className,
  ...props
}: RadixDialog.DialogProps & {
  trigger?: ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root {...props}>
      {!!trigger && (
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      )}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0" />
        <RadixDialog.Content
          className={clsx(
            "text-black z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-[6px] bg-white p-[25px] shadow-lg",
            className
          )}
        >
          {children}

          <RadixDialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export function DialogTitle({
  className,
  children,
  ...props
}: RadixDialog.DialogTitleProps) {
  return (
    <RadixDialog.Title
      className={clsx("text-black m-0 text-xl font-semibold", className)}
      {...props}
    >
      {children}
    </RadixDialog.Title>
  );
}

export function DialogDescription({
  className,
  children,
  ...props
}: RadixDialog.DialogDescriptionProps) {
  return (
    <RadixDialog.Title
      className={clsx("mt-[10px] mb-5 text-[15px] leading-normal", className)}
      {...props}
    >
      {children}
    </RadixDialog.Title>
  );
}
