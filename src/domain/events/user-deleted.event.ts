import { DomainEvent } from '../../application/interfaces/common/domain-event.interface';
import { User } from '../entities/user';

export class UserDeletedEvent implements DomainEvent {
  eventName = 'user.deleted';
  occurredOn: Date;
  
  constructor(public eventData: { authServiceUserId: string }) {
    this.occurredOn = new Date();
  }
}
