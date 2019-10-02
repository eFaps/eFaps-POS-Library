import { User } from './user';

export interface Balance {
  id: string;
  oid: string;
  number: string;
  startAt: Date;
  endAt: Date;
  status: 'OPEN' | 'CLOSED';
  user?: User;
}
