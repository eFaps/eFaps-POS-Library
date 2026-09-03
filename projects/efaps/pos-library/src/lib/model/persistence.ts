import { Company } from "./company";
import { Tokens } from "./tokens";

export interface PersistenceService {
  currentUser(): CurrentUser;
  currentCompany(): CurrentCompany;
  spotPositions(): PersistenceObject;
  workspaces(): PersistenceObject;
}

export interface PersistenceServiceProvider {
  get: () => PersistenceService;
}

export interface PersistenceObject {
  save(): void;
}

export interface CleanableObject {
  clean(): void;
}

export interface CurrentCompany extends Company, PersistenceObject {}

export interface CurrentUser extends PersistenceObject, CleanableObject {
  username: string | undefined;
  tokens: Tokens | undefined;
}
