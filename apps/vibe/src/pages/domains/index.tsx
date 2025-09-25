import { DomainCard, Domain } from "@/components/domains/DomainCard";
import DomainRegistrationModal from "@/components/domains/DomainRegistrationModal";
import { PlusCircle, Search, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { domainOrderService } from "@/services/domainOrderService";
import { useToast } from "@/hooks/use-toast";
import { DropResult, DroppableProvided } from "react-beautiful-dnd";

// Dynamic imports for performance optimization
const DragDropContext = lazy(() => import("react-beautiful-dnd").then(module => ({ default: module.DragDropContext })));
const Droppable = lazy(() => import("react-beautiful-dnd").then(module => ({ default: module.Droppable })));
const Draggable = lazy(() => import("react-beautiful-dnd").then(module => ({ default: module.Draggable })));

const mockDomains: Domain[] = [
  { id: "1", name: "softgen.ai", status: "active", expiresAt: "2026-07-28" },
  { id: "2", name: "example.com", status: "active", expiresAt: "2025-12-15" },
  { id: "3", name: "mysite.dev", status: "expired", expiresAt: "2024-06-01" },
  { id: "4", name: "anotherone.io", status: "active", expiresAt: "2027-01-20" },
  { id: "5", name: "testdomain.org", status: "active", expiresAt: "2025-09-10" },
  { id: "6", name: "oldproject.net", status: "expired", expiresAt: "2023-11-30" },
  { id: "7", name: "newidea.app", status: "active", expiresAt: "2026-05-22" },
  { id: "8", name: "portfolio.me", status: "active", expiresAt: "2028-02-14" },
];

const DomainsDashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");
  const [sortOrder, setSortOrder] = useState<"name" | "expiry">("name");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved domain order on component mount
  useEffect(() => {
    const loadDomainOrder = async () => {
      if (!user) {
        setDomains(mockDomains);
        setIsLoading(false);
        return;
      }

      try {
        const savedOrder = await domainOrderService.getDomainOrder(user.id);
        
        if (savedOrder.length > 0) {
          const orderedDomains = [...mockDomains].sort((a, b) => {
            const indexA = savedOrder.indexOf(a.id);
            const indexB = savedOrder.indexOf(b.id);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
          setDomains(orderedDomains);
        } else {
          setDomains(mockDomains);
        }
      } catch (error) {
        console.error("Failed to load domain order:", error);
        setDomains(mockDomains);
      } finally {
        setIsLoading(false);
      }
    };

    loadDomainOrder();
  }, [user]);

  // Memoized filtered and sorted domains
  const filteredDomains = useMemo(() => {
    let filtered = domains.filter(domain => 
      domain.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(domain => domain.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      }
    });
  }, [domains, searchQuery, statusFilter, sortOrder]);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination || !user) {
      return;
    }

    const items = Array.from(domains);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const originalOrder = [...domains];
    setDomains(items);

    try {
      const domainOrder = items.map(domain => domain.id);
      await domainOrderService.saveDomainOrder(user.id, domainOrder);
      toast({
        title: "Order saved",
        description: "Domain order has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save domain order:", error);
      setDomains(originalOrder);
      toast({
        title: "Error",
        description: "Failed to save domain order. Please try again.",
        variant: "destructive",
      });
    }
  }, [domains, user, toast]);

  const handleDomainAction = useCallback((action: string, domainId: string) => {
    toast({
      title: `${action} Domain`,
      description: `${action} action for domain ${domains.find(d => d.id === domainId)?.name} would be implemented here.`,
    });
  }, [domains, toast]);

  const handleRenew = useCallback((domainId: string) => {
    handleDomainAction("Renew", domainId);
  }, [handleDomainAction]);

  const handleTransfer = useCallback((domainId: string) => {
    handleDomainAction("Transfer", domainId);
  }, [handleDomainAction]);

  const handleDelete = useCallback((domainId: string) => {
    handleDomainAction("Delete", domainId);
  }, [handleDomainAction]);

  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">My Domains</h1>
        <Button className="bg-cyan-500 text-black hover:bg-cyan-400 flex items-center gap-2 w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Add Domain</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-slate-900/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl h-48 sm:h-56 animate-pulse"
          />
        ))}
      </div>
    </div>
  );

  if (!isClient || isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          My Domains
        </h1>
        <Button 
          onClick={() => setShowRegistrationModal(true)}
          className="bg-cyan-500 text-black hover:bg-cyan-400 flex items-center gap-2 w-full sm:w-auto transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
          aria-label="Add new domain"
        >
          <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Add Domain</span>
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
            aria-label="Search domains"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            aria-label="Show all domains"
          >
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
            className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            aria-label="Show active domains only"
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "expired" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("expired")}
            className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            aria-label="Show expired domains only"
          >
            Expired
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === "name" ? "expiry" : "name")}
          className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
          aria-label={`Sort by ${sortOrder === "name" ? "expiry date" : "name"}`}
        >
          <SortAsc className="h-4 w-4" />
          Sort by {sortOrder === "name" ? "Expiry" : "Name"}
        </Button>
      </div>

      {/* Domains Grid */}
      <Suspense fallback={<LoadingSkeleton />}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="domains">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
                role="grid"
                aria-label="Domain cards grid"
              >
                {filteredDomains.map((domain, index) => (
                  <Draggable key={domain.id} draggableId={domain.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                        className={`${snapshot.isDragging ? "opacity-80 scale-105" : ""} transition-all duration-200`}
                        role="gridcell"
                      >
                        <DomainCard 
                          domain={domain} 
                          onRenew={handleRenew}
                          onTransfer={handleTransfer}
                          onDelete={handleDelete}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Suspense>

      {/* Empty State */}
      {filteredDomains.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-4">
            {searchQuery || statusFilter !== "all" 
              ? "No domains match your search criteria" 
              : "No domains found"
            }
          </div>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Clear filters
            </Button>
          ) : (
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
              Add your first domain
            </Button>
          )}
        </div>
      )}

      {/* Sign-in Prompt */}
      {!user && (
        <div className="mt-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center">
          <p className="text-slate-300 mb-4">
            Sign in to save your custom domain order and sync across devices.
          </p>
          <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
            Sign In
          </Button>
        </div>
      )}

      {/* Domain Registration Modal */}
      <DomainRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        domainName="mynewdomain.com"
      />
    </div>
  );
};

export default DomainsDashboardPage;
