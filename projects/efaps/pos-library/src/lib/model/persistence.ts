import { Tokens } from "./tokens";

export interface PersitenceObject {
  save()
}

export interface CurrentUser extends PersitenceObject {
  username: string,
  tokens: Tokens,
}
