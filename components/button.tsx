import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  useColorMode,
} from "@chakra-ui/react";

export function Button({ children, _hover, ...props }: ChakraButtonProps) {
  const { colorMode } = useColorMode();
  return (
    <ChakraButton
      bg={`text.${colorMode}`}
      color={`bg.${colorMode}`}
      padding="0 20px"
      fontWeight="medium"
      transition="all 0.2s ease-in-out"
      _hover={{
        bg: `text.${colorMode}`,
        color: `bg.${colorMode}`,
        opacity: 0.8,
        ..._hover,
      }}
      {...props}
    >
      {children}
    </ChakraButton>
  );
}
