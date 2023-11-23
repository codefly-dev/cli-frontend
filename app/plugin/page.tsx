"use client";

import { ErrorCard } from "@/components/error-card";
import { Container } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { PluginPage } from "./plugin-page";

export default function Page() {
  const searchParams = useSearchParams();
  const publisher = searchParams?.get("publisher");
  const name = searchParams?.get("name");

  if (!publisher || !name) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={"Plugin publisher or name not defined in URL"} />
      </Container>
    );
  }

  return <PluginPage publisher={publisher} name={name} />;
}
