"use client";

import { ErrorCard } from "@/components/error-card";
import { Container } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { AgentPage } from "./agent-page";

export default function Page() {
  const searchParams = useSearchParams();
  // const publisher = searchParams?.get("publisher");
  const name = searchParams?.get("name");
  const version = searchParams?.get("version");

  if (!version || !name) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={"Agent version or name not defined in URL"} />
      </Container>
    );
  }

  return <AgentPage version={version} name={name} />;
}
