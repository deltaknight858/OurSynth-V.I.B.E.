
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, ArrowRightLeft, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, memo, useCallback } from "react";

export interface Domain {
  id: string;
  name: string;
  status: "active" | "expired";
  expiresAt: string;
}

interface DomainCardProps {
  domain: Domain;
  onRenew?: (domainId: string) => void;
  onTransfer?: (domainId: string) => void;
  onDelete?: (domainId: string) => void;
}

const neonButtonBaseClasses = "bg-transparent rounded-full w-10 h-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
const neonButtonCyanClasses = "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-md shadow-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/50 focus:ring-cyan-400";
const neonButtonRedClasses = "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/50 focus:ring-red-400";

export const DomainCard = memo(function DomainCard({ domain, onRenew, onTransfer, onDelete }: DomainCardProps) {
  const [formattedExpiryDate, setFormattedExpiryDate] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client, ensuring that date formatting
    // doesn't cause a hydration mismatch.
    const expiryDate = new Date(domain.expiresAt);
    const formatted = expiryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
    setFormattedExpiryDate(formatted);
  }, [domain.expiresAt]);

  const handleRenew = useCallback(() => {
    onRenew?.(domain.id);
  }, [onRenew, domain.id]);

  const handleTransfer = useCallback(() => {
    onTransfer?.(domain.id);
  }, [onTransfer, domain.id]);

  const handleDelete = useCallback(() => {
    onDelete?.(domain.id);
  }, [onDelete, domain.id]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  }, []);

  const isExpired = domain.status === "expired";

  return (
    <Card 
      className="bg-slate-900/30 backdrop-blur-lg border border-slate-700/50 text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 select-none focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-900"
      role="article"
      aria-labelledby={`domain-title-${domain.id}`}
      aria-describedby={`domain-status-${domain.id} domain-expiry-${domain.id}`}
    >
      <CardHeader 
        className="cursor-grab active:cursor-grabbing p-4 sm:p-6"
        role="button"
        tabIndex={0}
        aria-label={`Drag to reorder domain ${domain.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // Focus management for drag operations would be handled by parent
          }
        }}
      >
        <CardTitle 
          id={`domain-title-${domain.id}`}
          className="text-lg sm:text-xl lg:text-2xl font-bold truncate text-slate-100"
        >
          {domain.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 text-slate-300 p-4 sm:p-6 pt-0">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">Status</span>
          <Badge 
            id={`domain-status-${domain.id}`}
            variant={isExpired ? "destructive" : "default"} 
            className={cn(
              "text-white capitalize border-none text-xs sm:text-sm",
              isExpired ? "bg-red-500/80" : "bg-green-500/80"
            )}
            aria-label={`Domain status: ${domain.status}`}
          >
            {domain.status}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm">Expires On</span>
          <span 
            id={`domain-expiry-${domain.id}`}
            className="font-medium text-slate-100 h-6 text-xs sm:text-sm"
            aria-label={`Expires on ${formattedExpiryDate}`}
          >
            {formattedExpiryDate}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-1 sm:space-x-2 p-4 sm:p-6 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(neonButtonBaseClasses, neonButtonCyanClasses)}
                onClick={handleRenew}
                onKeyDown={(e) => handleKeyDown(e, handleRenew)}
                aria-label={`Renew domain ${domain.name}`}
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Renew Domain</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(neonButtonBaseClasses, neonButtonCyanClasses)}
                onClick={handleTransfer}
                onKeyDown={(e) => handleKeyDown(e, handleTransfer)}
                aria-label={`Transfer domain ${domain.name}`}
              >
                <ArrowRightLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Transfer Domain</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(neonButtonBaseClasses, neonButtonRedClasses)}
                onClick={handleDelete}
                onKeyDown={(e) => handleKeyDown(e, handleDelete)}
                aria-label={`Delete domain ${domain.name}`}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Domain</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
});
