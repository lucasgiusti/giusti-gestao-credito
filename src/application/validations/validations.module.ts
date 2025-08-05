import { Module } from '@nestjs/common';
import { IUserRepository } from '../interfaces/repositories/user.repository.interface';
import { UserValidationsSetup } from './user-validations.setup';

@Module({
  providers: [
    {
      provide: 'VALIDATIONS_INIT',
      useFactory: (userRepository: IUserRepository) => {
        UserValidationsSetup.initialize(userRepository);
        return true;
      },
      inject: [IUserRepository],
    },
  ],
  exports: ['VALIDATIONS_INIT'],
})
export class ValidationsModule {}