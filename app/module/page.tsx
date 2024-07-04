"use client";

import { ErrorCard } from "@/components/error-card";
import { Container } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { ModulePage } from "./module-page";

export default function Page() {
  const searchParams = useSearchParams();
  const moduleId = searchParams?.get("module");
  // const projectId = searchParams?.get("project");

  if (!moduleId) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={"Module ID not defined in URL"} />
      </Container>
    );
  }

  return <ModulePage moduleId={moduleId} />;
}
