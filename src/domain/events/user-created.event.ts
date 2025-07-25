import { DomainEvent } from './domain-event.interface';
import { User } from '../entities/user';

export class UserCreatedEvent implements DomainEvent {
  eventName = 'user.created';
  occurredOn: Date;
  
  constructor(public eventData: { user: User, authServiceUserId: string }) {
    this.occurredOn = new Date();
  }
}
