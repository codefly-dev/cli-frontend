import { Button, Icon, useColorMode } from "@chakra-ui/react";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import Link, { type LinkProps } from "next/link";
import { PropsWithChildren } from "react";

export function BreadcrumbLink({
  children,
  ...props
}: PropsWithChildren<LinkProps>) {
  const { colorMode } = useColorMode();
  return (
    <Link {...props}>
      <Button
        padding={0}
        fontWeight="normal"
        variant="ghost"
        color={`textMuted.${colorMode}`}
        leftIcon={<Icon as={CaretLeftIcon} boxSize={5} />}
        _hover={{ bg: "transparent" }}
      >
        {children}
      </Button>
    </Link>
  );
}
