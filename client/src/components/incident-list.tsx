import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { IncidentWithCamera } from "@shared/schema";

interface IncidentListProps {
  incidents: IncidentWithCamera[];
  onJumpToIncident: (incident: IncidentWithCamera) => void;
}

export default function IncidentList({ incidents, onJumpToIncident }: IncidentListProps) {
  const [resolvingIds, setResolvingIds] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const resolveMutation = useMutation({
    mutationFn: async (incidentId: number) => {
      const response = await apiRequest("PATCH", `/api/incidents/${incidentId}/resolve`);
      return response.json();
    },
    onMutate: async (incidentId) => {
      // Optimistic update
      setResolvingIds(prev => new Set(prev).add(incidentId));
    },
    onSuccess: () => {
      // Invalidate and refetch incidents
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({
        title: "Incident resolved",
        description: "The incident has been successfully resolved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to resolve incident. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: (_, __, incidentId) => {
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(incidentId);
        return newSet;
      });
    },
  });

  const handleResolve = (incident: IncidentWithCamera) => {
    resolveMutation.mutate(incident.id);
  };

  const formatTimeRange = (start: Date, end: Date) => {
    const startTime = start.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const endTime = end.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const date = start.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `${startTime} - ${endTime} on ${date}`;
  };

  const getIncidentColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return 'border-orange-500';
      case 'gun threat':
        return 'border-red-500';
      case 'face recognised':
        return 'border-green-500';
      case 'multiple events':
        return 'border-purple-500';
      case 'traffic congestion':
        return 'border-yellow-500';
      default:
        return 'border-slate-500';
    }
  };

  const getIncidentDotColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return 'bg-orange-500';
      case 'gun threat':
        return 'bg-red-500 animate-pulse';
      case 'face recognised':
        return 'bg-green-500';
      case 'multiple events':
        return 'bg-purple-500';
      case 'traffic congestion':
        return 'bg-yellow-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getIncidentTextColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return 'text-orange-400';
      case 'gun threat':
        return 'text-red-400';
      case 'face recognised':
        return 'text-green-400';
      case 'multiple events':
        return 'text-purple-400';
      case 'traffic congestion':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const unresolvedCount = incidents.filter(i => !i.resolved).length;

  return (
    <div className="w-96 card-bg border-l border-slate-700 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-white">
              {unresolvedCount} Unresolved Incidents
            </h2>
          </div>
          <button className="text-xs text-slate-400 hover:text-white transition-colors">
            4 resolved incidents
          </button>
        </div>
        
        {/* Incident Items */}
        <div className="space-y-4">
          {incidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No incidents found</p>
            </div>
          ) : (
            incidents.map((incident) => (
              <div 
                key={incident.id}
                className={`bg-slate-800 rounded-lg p-4 border-l-4 hover:bg-slate-700 transition-all cursor-pointer ${getIncidentColor(incident.type)} ${
                  resolvingIds.has(incident.id) ? 'opacity-50 scale-95' : ''
                }`}
                onClick={() => onJumpToIncident(incident)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={incident.thumbnailUrl} 
                      alt="Incident thumbnail" 
                      className="w-12 h-9 rounded object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getIncidentDotColor(incident.type)}`}></div>
                      <span className={`text-sm font-medium ${getIncidentTextColor(incident.type)}`}>
                        {incident.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {incident.camera.location}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {formatTimeRange(incident.tsStart, incident.tsEnd)}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(incident);
                    }}
                    disabled={resolvingIds.has(incident.id)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium disabled:opacity-50"
                  >
                    {resolvingIds.has(incident.id) ? 'Resolving...' : 'Resolve'} 
                    <ChevronRight className="inline w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
