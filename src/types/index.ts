// This interface was created in a previous step
export interface Value {
  id: string;
  name: string;
  definition: string;
}

// Add the new CanvasCard type as per Section 3.2
export interface CanvasCard {
  instanceId: string;
  value: Value;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isCore: boolean;
}
