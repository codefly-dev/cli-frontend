import type { RESTEndpoint } from "@/types";
import { API_URL } from "@/utils/constants";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import useSWR from "swr";

function Loader() {
  return (
    <div className="py-4">
      <p>Loading...</p>
    </div>
  );
}

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <Loader />,
});

export function RestEndpointPreview({ endpoint }: { endpoint: RESTEndpoint }) {
  const { data, error, isLoading } = useSWR<{ addresses: string[] }>(
    `/active/project/network-mapping/${endpoint.application}/${endpoint.service}/${endpoint.name}`,
    (route) => fetch(API_URL + route).then((res) => res.json())
  );

  return isLoading ? (
    <Loader />
  ) :  (
    <SwaggerUI
      spec={atob(endpoint.api.rest.openapi)}
      requestInterceptor={(req) => {
        const url = new URL(req.url);
        // req.url = data.addresses[0] + url.pathname;
        return req;
      }}
      // TODO: remove this when the endpoint is fixed.
      tryItOutEnabled={false}
    />
  );
}
