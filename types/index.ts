export type ServiceDependencies = {
  nodes: { id: string; value: boolean }[];
  edges: { from: `${string}/${string}`; to: `${string}/${string}` }[];
};

export type RESTEndpoint = {
  name: "rest";
  description: string;
  visibility: string;
  application: string;
  service: string;
  namespace: string;
  api: {
    rest: {
      openapi: string;
      routes: { methods: string[]; path: `/${string}` }[];
    };
  };
};

export type GRPCEndpoint = {
  name: "grpc";
  description: string;
  visibility: string;
  application: string;
  service: string;
  namespace: string;
  api: { grpc: { proto: string; rpc: { name: string }[] } };
};

export type Endpoint = RESTEndpoint | GRPCEndpoint;

export type Agent = {
  kind: "SERVICE";
  name: string;
  publisher: string;
  version: string;
};

export type Service = {
  name: string;
  description: string;
  application: string;
  agent: Agent;
  endpoints: Endpoint[];
};

export type Application = {
  name: string;
  description: string;
  project: string;
  services: Service[];
};

export type Project = {
  organization: {
    name: string;
    domain: string;
  };
  name: string;
  description: string;
  applications: Application[];
};

export type Log = {
  at: string;
  application: string;
  service: string;
  kind: "UNKNOWN" | "PLUGIN" | "SERVICE";
  message: string;
};
