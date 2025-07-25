import { DomainEvent } from './domain-event.interface';
import { User } from '../entities/user';

export class UserUpdatedEvent implements DomainEvent {
  eventName = 'user.updated';
  occurredOn: Date;
  
  constructor(public eventData: { user: User, authServiceUserId: string }) {
    this.occurredOn = new Date();
  }
}
