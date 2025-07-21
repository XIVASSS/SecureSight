import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
 
  app.get("/api/cameras", async (req, res) => {
    try {
      const cameras = await storage.getAllCameras();
      res.json(cameras);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

 
  app.get("/api/incidents", async (req, res) => {
    try {
      const resolvedParam = req.query.resolved as string | undefined;
      let resolved: boolean | undefined;
      
      if (resolvedParam !== undefined) {
        resolved = resolvedParam === "true";
      }
      
      const incidents = await storage.getIncidentsWithCamera(resolved);
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  
  app.patch("/api/incidents/:id/resolve", async (req, res) => {
    try {
      const idSchema = z.string().transform(val => parseInt(val, 10));
      const id = idSchema.parse(req.params.id);
      
      const updatedIncident = await storage.resolveIncident(id);
      
      if (!updatedIncident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      res.json(updatedIncident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid incident ID" });
      }
      res.status(500).json({ message: "Failed to resolve incident" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
