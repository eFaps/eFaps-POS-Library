import { HttpContextToken } from "@angular/common/http";

export const IGNORED_STATUSES = new HttpContextToken<number[]>(() => []);
