import { Tokens } from "./tokens";

export interface PersistenceService {
  currentCompany(): PersistenceObject;
  spotPositions(): PersistenceObject;
  workspaces(): PersistenceObject;
}

export interface PersistenceObject {
  save();
}

export interface CurrentUser extends PersistenceObject {
  username: string;
  tokens: Tokens;
}
