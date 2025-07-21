import type { InsertCamera, InsertIncident } from "@shared/schema";

export const seedCameras: InsertCamera[] = [
  { name: "Camera - 01", location: "Shop Floor A" },
  { name: "Camera - 02", location: "Vault" },
  { name: "Camera - 03", location: "Entrance" },
];

export const generateSeedIncidents = (): InsertIncident[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      cameraId: 1,
      type: "Unauthorised Access",
      tsStart: new Date(today.getTime() + 14 * 60 * 60 * 1000 + 35 * 60 * 1000), // 14:35
      tsEnd: new Date(today.getTime() + 14 * 60 * 60 * 1000 + 37 * 60 * 1000), // 14:37
      thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: 1,
      type: "Gun Threat",
      tsStart: new Date(today.getTime() + 17 * 60 * 60 * 1000 + 45 * 60 * 1000), // 17:45
      tsEnd: new Date(today.getTime() + 17 * 60 * 60 * 1000 + 47 * 60 * 1000), // 17:47
      thumbnailUrl: "https://images.unsplash.com/photo-1551522435-a13afa10f103?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    {
      cameraId: 3,
      type: "Face Recognised",
      tsStart: new Date(today.getTime() + 12 * 60 * 60 * 1000 + 15 * 60 * 1000), // 12:15
      tsEnd: new Date(today.getTime() + 12 * 60 * 60 * 1000 + 16 * 60 * 1000), // 12:16
      thumbnailUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
      resolved: false,
    },
    // Add more incidents as needed...
  ];
};
