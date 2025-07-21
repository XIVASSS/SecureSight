import { cameras, incidents, type Camera, type Incident, type InsertCamera, type InsertIncident, type IncidentWithCamera } from "@shared/schema";

export interface IStorage {
  // Camera operations
  getCamera(id: number): Promise<Camera | undefined>;
  getAllCameras(): Promise<Camera[]>;
  createCamera(camera: InsertCamera): Promise<Camera>;

  // Incident operations
  getIncident(id: number): Promise<Incident | undefined>;
  getIncidentsWithCamera(resolved?: boolean): Promise<IncidentWithCamera[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, updates: Partial<Incident>): Promise<Incident | undefined>;
  resolveIncident(id: number): Promise<Incident | undefined>;
}

export class MemStorage implements IStorage {
  private cameras: Map<number, Camera>;
  private incidents: Map<number, Incident>;
  private currentCameraId: number;
  private currentIncidentId: number;

  constructor() {
    this.cameras = new Map();
    this.incidents = new Map();
    this.currentCameraId = 1;
    this.currentIncidentId = 1;
    this.seedData();
  }

  private seedData() {
    // Create cameras
    const cameraData: InsertCamera[] = [
      { name: "Camera - 01", location: "Shop Floor A" },
      { name: "Camera - 02", location: "Vault" },
      { name: "Camera - 03", location: "Entrance" },
    ];

    cameraData.forEach(data => {
      const camera: Camera = { ...data, id: this.currentCameraId++ };
      this.cameras.set(camera.id, camera);
    });

    // Create incidents spanning 24 hours
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const incidentData: InsertIncident[] = [
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
      {
        cameraId: 2,
        type: "Multiple Events",
        tsStart: new Date(today.getTime() + 9 * 60 * 60 * 1000 + 22 * 60 * 1000), // 09:22
        tsEnd: new Date(today.getTime() + 9 * 60 * 60 * 1000 + 25 * 60 * 1000), // 09:25
        thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 3,
        type: "Traffic Congestion",
        tsStart: new Date(today.getTime() + 8 * 60 * 60 * 1000 + 45 * 60 * 1000), // 08:45
        tsEnd: new Date(today.getTime() + 8 * 60 * 60 * 1000 + 50 * 60 * 1000), // 08:50
        thumbnailUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 1,
        type: "Unauthorised Access",
        tsStart: new Date(today.getTime() + 16 * 60 * 60 * 1000 + 10 * 60 * 1000), // 16:10
        tsEnd: new Date(today.getTime() + 16 * 60 * 60 * 1000 + 12 * 60 * 1000), // 16:12
        thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 2,
        type: "Face Recognised",
        tsStart: new Date(today.getTime() + 10 * 60 * 60 * 1000 + 30 * 60 * 1000), // 10:30
        tsEnd: new Date(today.getTime() + 10 * 60 * 60 * 1000 + 31 * 60 * 1000), // 10:31
        thumbnailUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 3,
        type: "Unauthorised Access",
        tsStart: new Date(today.getTime() + 13 * 60 * 60 * 1000 + 20 * 60 * 1000), // 13:20
        tsEnd: new Date(today.getTime() + 13 * 60 * 60 * 1000 + 22 * 60 * 1000), // 13:22
        thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 1,
        type: "Traffic Congestion",
        tsStart: new Date(today.getTime() + 7 * 60 * 60 * 1000 + 15 * 60 * 1000), // 07:15
        tsEnd: new Date(today.getTime() + 7 * 60 * 60 * 1000 + 20 * 60 * 1000), // 07:20
        thumbnailUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 2,
        type: "Gun Threat",
        tsStart: new Date(today.getTime() + 19 * 60 * 60 * 1000 + 45 * 60 * 1000), // 19:45
        tsEnd: new Date(today.getTime() + 19 * 60 * 60 * 1000 + 46 * 60 * 1000), // 19:46
        thumbnailUrl: "https://images.unsplash.com/photo-1551522435-a13afa10f103?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 3,
        type: "Multiple Events",
        tsStart: new Date(today.getTime() + 21 * 60 * 60 * 1000 + 30 * 60 * 1000), // 21:30
        tsEnd: new Date(today.getTime() + 21 * 60 * 60 * 1000 + 35 * 60 * 1000), // 21:35
        thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
      {
        cameraId: 1,
        type: "Face Recognised",
        tsStart: new Date(today.getTime() + 15 * 60 * 60 * 1000 + 45 * 60 * 1000), // 15:45
        tsEnd: new Date(today.getTime() + 15 * 60 * 60 * 1000 + 46 * 60 * 1000), // 15:46
        thumbnailUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=60",
        resolved: false,
      },
    ];

    incidentData.forEach(data => {
      const incident: Incident = { ...data, id: this.currentIncidentId++ };
      this.incidents.set(incident.id, incident);
    });
  }

  async getCamera(id: number): Promise<Camera | undefined> {
    return this.cameras.get(id);
  }

  async getAllCameras(): Promise<Camera[]> {
    return Array.from(this.cameras.values());
  }

  async createCamera(insertCamera: InsertCamera): Promise<Camera> {
    const id = this.currentCameraId++;
    const camera: Camera = { ...insertCamera, id };
    this.cameras.set(id, camera);
    return camera;
  }

  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async getIncidentsWithCamera(resolved?: boolean): Promise<IncidentWithCamera[]> {
    const allIncidents = Array.from(this.incidents.values());
    const filteredIncidents = resolved !== undefined 
      ? allIncidents.filter(incident => incident.resolved === resolved)
      : allIncidents;

    // Sort by newest first (tsStart descending)
    filteredIncidents.sort((a, b) => b.tsStart.getTime() - a.tsStart.getTime());

    return filteredIncidents.map(incident => {
      const camera = this.cameras.get(incident.cameraId);
      if (!camera) {
        throw new Error(`Camera with id ${incident.cameraId} not found`);
      }
      return { ...incident, camera };
    });
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.currentIncidentId++;
    const incident: Incident = { ...insertIncident, id };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncident(id: number, updates: Partial<Incident>): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) {
      return undefined;
    }
    
    const updatedIncident = { ...incident, ...updates };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  async resolveIncident(id: number): Promise<Incident | undefined> {
    return this.updateIncident(id, { resolved: true });
  }
}

export const storage = new MemStorage();
