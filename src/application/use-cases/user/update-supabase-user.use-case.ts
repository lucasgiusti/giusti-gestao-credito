import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/infraestructure/config/supabase.config';
import { DomainEvent } from 'src/application/interfaces/common/domain-event.interface';
import { UserCreatedEvent } from 'src/domain/events/user-created.event';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserUpdatedEvent } from 'src/domain/events/user-updated.event';
import { User } from 'src/domain/entities/user';

@Injectable()
export class UpdateSupabaseUserUseCase {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly eventBus: EventBusService,
  ) {
    this.eventBus.subscribe('user.created', this.handleUserCreated.bind(this));
    this.eventBus.subscribe('user.updated', this.handleUserUpdated.bind(this));
  }

  private async handleUserCreated(event: DomainEvent): Promise<void> {
    const { user, authServiceUserId } = (event as UserCreatedEvent).eventData;
    
    await this.updateUser(user, authServiceUserId);
  }

  private async handleUserUpdated(event: DomainEvent): Promise<void> {
    const { user, authServiceUserId } = (event as UserUpdatedEvent).eventData;
    
    await this.updateUser(user, authServiceUserId);
  }

  private async updateUser(user: User, authServiceUserId: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.getClient().auth.admin.updateUserById(
        authServiceUserId,
        {
          user_metadata: { 
            name: user.name,
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
