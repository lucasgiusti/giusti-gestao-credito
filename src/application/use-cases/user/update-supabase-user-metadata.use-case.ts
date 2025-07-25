import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/infraestructure/config/supabase.config';
import { DomainEvent } from 'src/domain/events/domain-event.interface';
import { UserCreatedEvent } from 'src/domain/events/user-created.event';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';

@Injectable()
export class UpdateSupabaseUserMetadataUseCase {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly eventBus: EventBusService,
  ) {
    this.eventBus.subscribe('user.created', this.handleUserCreated.bind(this));
  }

  private async handleUserCreated(event: DomainEvent): Promise<void> {
    const { user, authServiceUserId } = (event as UserCreatedEvent).eventData;
    
    try {
      const { data, error } = await this.supabaseService.getClient().auth.admin.updateUserById(
        authServiceUserId,
        {
          user_metadata: { 
            role: user.userRole,
            status: user.status,
         }
        }
      );
      
      if (error) {
        throw new Error('error.on.update.user.metadata');
      }
    } catch (error) {
      throw error;
    }
  }
}
