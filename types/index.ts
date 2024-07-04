export type ServiceDependencies = {
  nodes: { id: string; value: boolean }[];
  edges: { from: `${string}/${string}`; to: `${string}/${string}` }[];
};

export type RESTEndpoint = {
  name: "rest";
  description: string;
  visibility: string;
  module: string;
  service: string;
  namespace: string;
  api: string;
  apiDetails: {
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
  module: string;
  service: string;
  namespace: string;
  api: string;
  apiDetails: { grpc: { proto: string; rpc: { name: string }[] } };
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
  module: string;
  agent: Agent;
  endpoints: Endpoint[];
  serviceDependencies : any[]
};

export type Module = {
  name: string;
  description: string;
  services: Service[];
};

export type Workspace = {
  name: string;
  description: string;
  modules: Module[];
};

export type Log = {
  at: string;
  module: string;
  service: string;
  kind: "UNKNOWN" | "PLUGIN" | "SERVICE";
  message: string;
};
