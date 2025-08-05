import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../application/interfaces/common/domain-event.interface';

type EventHandler = (event: DomainEvent) => Promise<void>;

@Injectable()
export class EventBusService {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName).push(handler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName) || [];
    
    await Promise.all(
      eventHandlers.map(handler => 
        handler(event).catch(error => 
          console.error(`Error handling event ${event.eventName}:`, error)
        )
      )
    );
  }
}
