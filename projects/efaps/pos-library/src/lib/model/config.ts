import { PersistenceService } from './persistence';

export interface PosConfig {
  baseUrl: string;
  socketUrl: string;
  defaultProdImg?: string;
  persistence?: PersistenceService;
}
