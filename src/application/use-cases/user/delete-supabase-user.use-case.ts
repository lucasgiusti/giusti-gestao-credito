import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/infraestructure/config/supabase.config';
import { DomainEvent } from 'src/application/interfaces/common/domain-event.interface';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserDeletedEvent } from 'src/domain/events/user-deleted.event';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

@Injectable()
export class DeleteSupabaseUserUseCase {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly eventBus: EventBusService,
  ) {
    this.eventBus.subscribe('user.deleted', this.handleUserDeleted.bind(this));
  }

  private async handleUserDeleted(event: DomainEvent): Promise<void> {
    const { authServiceUserId } = (event as UserDeletedEvent).eventData;
    
    await this.deleteUser(authServiceUserId);
  }

  private async deleteUser(authServiceUserId: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.getClient().auth.admin.deleteUser(
        authServiceUserId,
      );
      
      if (error) {
        throw new Error(ErrorMessages.ERROR_ON_DELETE_USER_METADATA);
      }
    } catch (error) {
      throw error;
    }
  }
}
