import { useState } from "react";
import Navbar from "@/components/navbar";
import IncidentPlayer from "@/components/incident-player";
import IncidentList from "@/components/incident-list";
import InteractiveTimeline from "@/components/interactive-timeline";
import { useQuery } from "@tanstack/react-query";
import type { Camera, IncidentWithCamera } from "@shared/schema";

export default function Dashboard() {
  const [selectedCameraId, setSelectedCameraId] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch cameras
  // const { data: cameras = [], isLoading: camerasLoading } = useQuery<Camera[]>({
  //   queryKey: ["/api/cameras"],
  // });
  const cameras = [{
    id: 1,
    name: "camera 1",
    location: "Loaction 1",
  },{
    id: 2,
    name: "camera 2",
    location: "Loaction 2",
  },
  {
    id: 3,
    name: "camera 3",
    location: "Loaction 3",
  }
] 

const camerasLoading = false;
  // Fetch unresolved incidents
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<IncidentWithCamera[]>({
    queryKey: ["/api/incidents", "resolved=false"],
  });

  const selectedCamera = cameras.find(camera => camera.id === selectedCameraId) || cameras[0];

  const handleCameraSelect = (cameraId: number) => {
    setSelectedCameraId(cameraId);
  };

  const handleTimeChange = (time: Date) => {
    setCurrentTime(time);
  };

  const handleJumpToIncident = (incident: IncidentWithCamera) => {
    setSelectedCameraId(incident.cameraId);
    setCurrentTime(incident.tsStart);
  };

  if (camerasLoading || incidentsLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="loading-shimmer w-32 h-8 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      <div className="flex h-screen pt-20">
        {/* Main content area */}
        <div className="flex-1 p-6 space-y-6">
          <IncidentPlayer 
            cameras={cameras}
            selectedCamera={selectedCamera}
            onCameraSelect={handleCameraSelect}
            currentTime={currentTime}
          />
        </div>

        {/* Incident sidebar */}
        <IncidentList 
          incidents={incidents}
          onJumpToIncident={handleJumpToIncident}
        />
      </div>

      {/* Timeline */}
      <InteractiveTimeline
        cameras={cameras}
        incidents={incidents}
        selectedCameraId={selectedCameraId}
        currentTime={currentTime}
        onCameraSelect={handleCameraSelect}
        onTimeChange={handleTimeChange}
        onJumpToIncident={handleJumpToIncident}
      />
    </div>
  );
}
