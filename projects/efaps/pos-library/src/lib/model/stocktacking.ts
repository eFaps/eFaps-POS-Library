import { User } from "./user";

export interface Stocktaking {
  id: string;
  number: string;
  startAt: Date;
  endAt: Date;
  status: "OPEN" | "CLOSED";
  user?: User;
}
