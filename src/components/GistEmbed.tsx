import { useEffect, useId, useMemo, useRef } from "react";

type GistEmbedProps = {
  src: string;
  title?: string;
};

export default function GistEmbed({ src, title = "GitHub Gist" }: GistEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const reactId = useId();
  const iframeId = useMemo(() => reactId.replace(/[^a-zA-Z0-9_-]/g, "_"), [reactId]);

  const srcDoc = useMemo(() => {
    const safeSrc = String(src);
    return [
      "<!doctype html>",
      "<html>",
      "<head>",
      '<meta charset="utf-8" />',
      '<meta name="referrer" content="no-referrer-when-downgrade" />',
      '<base target="_blank" />',
      "<style>body{margin:0} .gist{margin:0}</style>",
      "</head>",
      "<body>",
      `<script src="${safeSrc}"></script>`,
      "<script>",
      "(function(){",
      `var id=${JSON.stringify(iframeId)};`,
      "function send(){",
      "  try {",
      "    var h=document.documentElement.scrollHeight||document.body.scrollHeight||0;",
      "    parent.postMessage({type:'gist-resize',id:id,height:h},'*');",
      "  } catch (e) {}",
      "}",
      "send();",
      "window.addEventListener('load',function(){send(); setTimeout(send,50); setTimeout(send,250); setTimeout(send,1000);});",
      "if (typeof ResizeObserver !== 'undefined') {",
      "  try { new ResizeObserver(send).observe(document.documentElement); } catch (e) {}",
      "}",
      "})();",
      "</script>",
      "</body>",
      "</html>",
    ].join("");
  }, [iframeId, src]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      if (event.source !== iframe.contentWindow) return;

      const data = event.data as { type?: unknown; id?: unknown; height?: unknown } | null;
      if (!data || data.type !== "gist-resize" || data.id !== iframeId) return;
      if (typeof data.height !== "number" || !Number.isFinite(data.height)) return;

      iframe.style.height = `${Math.max(0, data.height)}px`;
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeId]);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      className="my-6 w-full rounded-lg border border-border bg-background"
      scrolling="no"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
    />
  );
}
