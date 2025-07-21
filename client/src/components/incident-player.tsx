import { useEffect, useRef, useState } from "react";
import { Play, Pause, Maximize2 } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import type { Camera } from "@shared/schema";

interface IncidentPlayerProps {
  cameras: Camera[];
  selectedCamera?: Camera;
  onCameraSelect: (cameraId: number) => void;
  currentTime: Date;
}

export default function IncidentPlayer({ 
  cameras, 
  selectedCamera, 
  onCameraSelect, 
  currentTime 
}: IncidentPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { stream, isLoading, error, requestCamera } = useCamera();

  useEffect(() => {
    // Request camera access when component mounts
    requestCamera();
  }, [requestCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(',', ' -');
  };

  return (
    <div className="space-y-6">
      {/* Main Video Player */}
      <div className="card-bg rounded-xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video bg-slate-800 camera-feed">
          {/* Video element for live camera */}
          {stream && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="loading-shimmer w-32 h-8 rounded"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="text-center">
                <p className="text-red-400 mb-2">Camera access denied</p>
                <p className="text-slate-400 text-sm">Please allow camera access to view live feed</p>
              </div>
            </div>
          )}

          {/* Fallback image when no camera */}
          {!stream && !isLoading && !error && (
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
              alt="Security camera feed" 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Camera Info Overlay */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-sm font-medium text-white">
              {selectedCamera?.name || "Camera - 01"}
            </div>
            <div className="text-xs text-slate-300">
              {selectedCamera?.location || "Shop Floor A"}
            </div>
          </div>
          
          {/* Live Indicator */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-white">LIVE</span>
          </div>
          
          {/* Timestamp */}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-sm font-mono text-white">
              {formatTimestamp(currentTime)}
            </div>
          </div>
          
          {/* Recording Controls */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <button 
              onClick={handlePlayPause}
              className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 hover:bg-slate-700/80 transition-colors"
            >
              {isPlaying ? (
                <Pause className="text-white w-4 h-4" />
              ) : (
                <Play className="text-white w-4 h-4" />
              )}
            </button>
            <button 
              onClick={handleFullscreen}
              className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 hover:bg-slate-700/80 transition-colors"
            >
              <Maximize2 className="text-white w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Camera Thumbnails Strip */}
      <div className="flex space-x-4">
        {cameras.map((camera) => (
          <div 
            key={camera.id}
            onClick={() => onCameraSelect(camera.id)}
            className={`flex-1 card-bg rounded-lg overflow-hidden hover:bg-slate-800 transition-colors cursor-pointer border-2 ${
              selectedCamera?.id === camera.id ? 'border-orange-500' : 'border-slate-700'
            }`}
          >
            <div className="aspect-video bg-slate-800 relative">
              <img 
                src={getCameraThumbnail(camera.id)} 
                alt={`${camera.name} - ${camera.location}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-slate-900/80 backdrop-blur-sm rounded px-2 py-1">
                <div className="text-xs font-medium text-white">{camera.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCameraThumbnail(cameraId: number): string {
  const thumbnails = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
    "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
    "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
  ];
  return thumbnails[(cameraId - 1) % thumbnails.length];
}
