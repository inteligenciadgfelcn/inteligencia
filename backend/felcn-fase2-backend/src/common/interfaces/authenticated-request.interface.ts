import { User } from './user.interface';

export interface AuthenticatedRequest extends Request {
  user: User;
}
