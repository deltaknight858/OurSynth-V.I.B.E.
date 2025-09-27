
import { useState, useEffect, useRef } from "react";
import { useDeployments } from "@/hooks/useDeployments";
import { Button } from "@/components/ui/button";
import { Pause, Play, Download, Trash2 } from "lucide-react";

interface LogViewerProps {
  siteId: string;
}

export default function LogViewer({ siteId }: LogViewerProps) {
  const { getLogs } = useDeployments();
  const [logs, setLogs] = useState<string[]>([]);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stopStreamingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setLogs([]);
    setIsStreaming(true);

    const stopStreaming = getLogs(siteId, (newLog) => {
      setLogs((prevLogs) => [...prevLogs, newLog]);
    });

    stopStreamingRef.current = stopStreaming;

    const timer = setTimeout(() => {
      setIsStreaming(false);
    }, 12000);

    return () => {
      clearTimeout(timer);
      if (stopStreaming) {
        stopStreaming();
      }
    };
  }, [siteId, getLogs]);

  useEffect(() => {
    if (isAutoScrollEnabled && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs, isAutoScrollEnabled]);

  const handleDownloadLogs = () => {
    const logContent = logs.join("\n");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deployment-logs-${siteId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="glass-card relative p-6 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/10">
      {/* Neon-etched title */}
      <div className="absolute -top-3.5 left-6 bg-slate-900 px-3">
        <h3 className="text-sm font-medium neon-text flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          Deployment Logs
          {isStreaming && (
            <span className="text-xs text-cyan-300/70 animate-pulse">
              (streaming...)
            </span>
          )}
        </h3>
      </div>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadLogs}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
          title="Download logs"
          disabled={logs.length === 0}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearLogs}
          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          title="Clear logs"
          disabled={logs.length === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
          className={`h-8 w-8 transition-colors ${
            isAutoScrollEnabled 
              ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10" 
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
          title={isAutoScrollEnabled ? "Pause auto-scroll" : "Enable auto-scroll"}
        >
          {isAutoScrollEnabled ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Log display area */}
      <div className="mt-4 relative">
        <textarea
          ref={textareaRef}
          readOnly
          value={logs.join("\n")}
          placeholder="Waiting for deployment logs..."
          className="w-full h-96 bg-black/30 border border-gray-700/50 rounded-lg p-4 font-mono text-sm text-green-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent placeholder-gray-500"
          style={{
            textShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
          }}
        />
        
        {/* Streaming indicator */}
        {isStreaming && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-cyan-500/30">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-cyan-300">Live</span>
          </div>
        )}
        
        {/* Log count indicator */}
        {logs.length > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-gray-400 border border-gray-600/50">
            {logs.length} lines
          </div>
        )}
      </div>
    </div>
  );
}
