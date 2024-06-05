import { Dialog, DialogTitle } from "@/components/dialog";
import { API_URL } from "@/utils/constants";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Markdown from "react-markdown";
import useSWR from "swr";

export function AgentModal({
  name,
  version,
  open,
  onClose,
  undoPreviewHistory,
}: {
  name?: string;
  version?: string;
  open: boolean;
  onClose: () => void;
  undoPreviewHistory?(): void;
}) {
  const {
    data: agent,
    error,
    isLoading,
  } = useSWR<{
    protocols: { type: string }[];
    capabilities: { type: string }[];
    languages: { type: string }[];
    readMe: string;
  }>(open ? `/overall/agent/${name}:${version}/information` : null, (route) =>
    fetch(API_URL + route).then((res) => res.json())
  );


  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => !open && onClose()}
        className="!max-w-[800px]"
      >
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Could not load agent information"
        ) : agent && open ? (
          <>
            <div className="flex gap-2">
              {!!undoPreviewHistory && (
                <button className="cursor-pointer" onClick={undoPreviewHistory}>
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
              )}

              <DialogTitle>
                {name}:{version}
              </DialogTitle>
            </div>

            <div className="grid grid-cols-[2fr_1fr] mt-4">
              <div className="markdown">
                <Markdown>{agent.readMe}</Markdown>
              </div>
              <div>
                <div className="flex flex-col gap-4 sticky top-0">
                  {[
                    { name: "Languages", list: agent.languages },
                    { name: "Protocols", list: agent.protocols },
                    { name: "Capabilities", list: agent.capabilities },
                  ].map((tab) =>
                    tab?.list?.length > 0 ? (
                      <div className="flex flex-col" key={tab.name}>
                        <span className="text-neutral-500 text-sm">
                          {tab.name}
                        </span>
                        <span className="font-mono text-xs">
                          {tab.list.map(({ type }) => type).join(", ")}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Dialog>
    </>
  );
}
