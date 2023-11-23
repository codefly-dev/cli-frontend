"use client";

import { ErrorCard } from "@/components/error-card";
import { Container } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { ApplicationPage } from "./application-page";

export default function Page() {
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get("application");
  const projectId = searchParams?.get("project");

  if (!applicationId || !projectId) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={"Project or application not defined in URL"} />
      </Container>
    );
  }

  return (
    <ApplicationPage applicationId={applicationId} projectId={projectId} />
  );
}
