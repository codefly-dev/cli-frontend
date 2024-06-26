"use client";

import { ErrorCard } from "@/components/error-card";
import { Container } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { ModulePage } from "./module-page";

export default function Page() {
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get("application");
  // const projectId = searchParams?.get("project");

  if (!applicationId) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={"Application ID not defined in URL"} />
      </Container>
    );
  }

  return <ModulePage moduleId={applicationId} />;
}
