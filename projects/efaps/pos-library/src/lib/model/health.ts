export interface Health {
  status: HealthStatus;
}

export enum HealthStatus {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
}
