import { Tokens } from "./tokens";

export interface PersistenceService {
  currentUser(): CurrentUser;
  currentCompany(): PersistenceObject;
  spotPositions(): PersistenceObject;
  workspaces(): PersistenceObject;
}

export interface PersistenceObject {
  save();
}

export interface CleanableObject {
  clean();
}

export interface CurrentUser extends PersistenceObject, CleanableObject {
  username: string | undefined;
  tokens: Tokens | undefined;
}
