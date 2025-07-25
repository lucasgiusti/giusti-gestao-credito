export interface DomainEvent {
  eventName: string;
  eventData: any;
  occurredOn: Date;
}
