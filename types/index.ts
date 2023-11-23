export type Plugin = {
  usage: {
    base: string;
    uses: {
      project: string;
      application: string;
      unique: string;
      version: string;
    }[];
  };
};

export type Endpoint = {
  name: string;
  apis: { name: string };
};

export type Deployment = {
  deployment: { name: string };
  information: { version: string };
};

export type Service = {
  name: string;
  unique: string;
  base: string;
  version: string;
  endpoints: Endpoint[];
};

export type ServiceInformation = {
  source: {
    information: { version: string };
  };
  deployments: Deployment[];
};

export type Application = {
  name: string;
  unique: string;
  services: Service[];
};

export type Project = {
  name: string;
  unique: string;
  applications: Application[];
};

export type Log = {
  at: string;
  application: string;
  service: string;
  kind: "UNKNOWN" | "PLUGIN" | "SERVICE";
  message: string;
};
