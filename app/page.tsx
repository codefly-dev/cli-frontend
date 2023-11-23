"use client";

import { ErrorCard } from "@/components/error-card";
import { Container } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { ProjectPage } from "./project-page";

export default function Page() {
  return <ProjectPage />;
}
