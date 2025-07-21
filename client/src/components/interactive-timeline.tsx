import { useRef, useEffect, useState } from "react";
import { Video } from "lucide-react";
import type { Camera, IncidentWithCamera } from "@shared/schema";

interface InteractiveTimelineProps {
  cameras: Camera[];
  incidents: IncidentWithCamera[];
  selectedCameraId: number;
  currentTime: Date;
  onCameraSelect: (cameraId: number) => void;
  onTimeChange: (time: Date) => void;
  onJumpToIncident: (incident: IncidentWithCamera) => void;
}

export default function InteractiveTimeline({
  cameras,
  incidents,
  selectedCameraId,
  currentTime,
  onCameraSelect,
  onTimeChange,
  onJumpToIncident,
}: InteractiveTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(1040);

  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const getIncidentColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return '#F97316';
      case 'gun threat':
        return '#EF4444';
      case 'face recognised':
        return '#10B981';
      case 'multiple events':
        return '#8B5CF6';
      case 'traffic congestion':
        return '#EAB308';
      default:
        return '#64748B';
    }
  };

  const getIncidentSymbol = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return '!';
      case 'gun threat':
        return '⚠';
      case 'face recognised':
        return '✓';
      case 'multiple events':
        return '⚡';
      case 'traffic congestion':
        return '🚦';
      default:
        return '?';
    }
  };

  const timeToX = (time: Date) => {
    const startOfDay = new Date(time);
    startOfDay.setHours(0, 0, 0, 0);
    const msInDay = 24 * 60 * 60 * 1000;
    const msFromStart = time.getTime() - startOfDay.getTime();
    const ratio = msFromStart / msInDay;
    return 80 + (ratio * (timelineWidth - 160)); // 80px margin on each side
  };

  const xToTime = (x: number) => {
    const ratio = (x - 80) / (timelineWidth - 160);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const msInDay = 24 * 60 * 60 * 1000;
    return new Date(today.getTime() + (ratio * msInDay));
  };

  const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
    if (e.target instanceof SVGElement && e.target.closest('.scrubber-group')) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    if (isDragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = xToTime(x);
      onTimeChange(newTime);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTimelineClick = (e: React.MouseEvent<SVGElement>) => {
    if (!isDragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = xToTime(x);
      onTimeChange(newTime);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  // Generate hour markers
  const hourMarkers = Array.from({ length: 13 }, (_, i) => {
    const hour = i * 2;
    const x = 80 + (i * 80);
    return (
      <g key={hour} transform={`translate(${x},0)`}>
        <line x1="0" y1="90" x2="0" y2="100" stroke="#64748B" strokeWidth="2"/>
        <text x="0" y="115" textAnchor="middle" className="text-xs fill-slate-400 font-mono">
          {hour.toString().padStart(2, '0')}:00
        </text>
      </g>
    );
  });

  return (
    <div className="card-bg border-t border-slate-700 p-6">
      <div className="space-y-4">
        {/* Camera List */}
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-700">
          <span className="text-sm font-medium text-slate-300">Camera List</span>
          <div className="flex items-center space-x-2">
            {cameras.map((camera) => (
              <div 
                key={camera.id}
                onClick={() => onCameraSelect(camera.id)}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                  selectedCameraId === camera.id 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-slate-800 hover:bg-slate-600'
                }`}
              >
                <Video className={`w-3 h-3 ${
                  selectedCameraId === camera.id ? 'text-slate-300' : 'text-slate-400'
                }`} />
                <span className={`text-sm ${
                  selectedCameraId === camera.id ? 'text-slate-300' : 'text-slate-400'
                }`}>
                  {camera.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Timeline Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-300">24 Hour Timeline</span>
            <div className="text-xs text-slate-400 font-mono">
              Current Time: {formatCurrentTime(currentTime)}
            </div>
          </div>
          
          {/* Timeline SVG */}
          <div className="relative bg-slate-800 rounded-lg p-4 overflow-x-auto">
            <svg 
              ref={svgRef}
              width="100%" 
              height="120" 
              className="timeline-svg cursor-pointer"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onClick={handleTimelineClick}
            >
              {/* Timeline Background */}
              <defs>
                <pattern id="timeGrid" x="0" y="0" width="80" height="120" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="120" stroke="#334155" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="120" fill="url(#timeGrid)"/>
              
              {/* Hour Markers */}
              <g className="hour-markers">
                {hourMarkers}
              </g>
              
              {/* Incident Markers */}
              <g className="incident-markers">
                {incidents.map((incident) => {
                  const x = timeToX(incident.tsStart);
                  const color = getIncidentColor(incident.type);
                  const symbol = getIncidentSymbol(incident.type);
                  
                  return (
                    <g 
                      key={incident.id}
                      className="incident-group cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToIncident(incident);
                      }}
                    >
                      <rect 
                        x={x - 4} 
                        y="20" 
                        width="8" 
                        height="60" 
                        rx="4" 
                        fill={color} 
                        opacity="0.8"
                      />
                      <circle 
                        cx={x} 
                        cy="15" 
                        r="6" 
                        fill={color} 
                        opacity="0.9"
                      />
                      <text 
                        x={x} 
                        y="19" 
                        textAnchor="middle" 
                        className="text-xs fill-white font-bold"
                      >
                        {symbol}
                      </text>
                    </g>
                  );
                })}
              </g>
              
              {/* Current Time Scrubber */}
              <g className={`scrubber-group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                {(() => {
                  const x = timeToX(currentTime);
                  const timeStr = currentTime.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  });
                  
                  return (
                    <>
                      <line 
                        x1={x} 
                        y1="0" 
                        x2={x} 
                        y2="120" 
                        stroke="#3B82F6" 
                        strokeWidth="3"
                      />
                      <circle 
                        cx={x} 
                        cy="50" 
                        r="8" 
                        fill="#3B82F6" 
                        stroke="#1E293B" 
                        strokeWidth="2"
                      />
                      <rect 
                        x={x - 20} 
                        y="5" 
                        width="40" 
                        height="20" 
                        rx="4" 
                        fill="#1E293B" 
                        stroke="#3B82F6" 
                        strokeWidth="1"
                      />
                      <text 
                        x={x} 
                        y="18" 
                        textAnchor="middle" 
                        className="text-xs fill-blue-400 font-mono font-bold"
                      >
                        {timeStr}
                      </text>
                    </>
                  );
                })()}
              </g>
            </svg>
          </div>
          
          {/* Timeline Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Unauthorised Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Gun Threat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Face Recognised</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Multiple Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Current Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
