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
  const { data, error, isLoading } = useSWR<{ address: string }>(
    `/workspace/network-mapping/${endpoint.module}/${endpoint.service}/${endpoint.name}`,
    (route) => fetch(API_URL + route).then((res) => res.json())
  );

  return isLoading ? (
    <Loader />
  ) :  (
    <SwaggerUI
      spec={atob(endpoint.apiDetails.rest.openapi)}
      requestInterceptor={(req) => {
        const url = new URL(req.url);
        if(data?.address) {
            req.url = data.address + url.pathname;
        }
        
        return req;
      }}
      tryItOutEnabled={!data?.address}
    />
  );
}
