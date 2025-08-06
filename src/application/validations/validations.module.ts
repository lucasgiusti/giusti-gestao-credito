import { Module } from '@nestjs/common';
import { IUserRepository } from '../interfaces/repositories/user.repository.interface';
import { UserValidationsSetup } from './user-validations.setup';
import { CarteiraValidationsSetup } from './carteira-validations.setup';
import { ICarteiraRepository } from '../interfaces/repositories/carteira.repository.interface';
import { IProcessoRepository } from '../interfaces/repositories/processo.repository.interface';

@Module({
  providers: [
    {
      provide: 'VALIDATIONS_INIT',
      useFactory: (userRepository: IUserRepository, carteiraRepository: ICarteiraRepository, processoRepository: IProcessoRepository) => {
        UserValidationsSetup.initialize(userRepository);
        CarteiraValidationsSetup.initialize(carteiraRepository, processoRepository);
        return true;
      },
      inject: [IUserRepository, ICarteiraRepository, IProcessoRepository],
    },
  ],
  exports: ['VALIDATIONS_INIT'],
})
export class ValidationsModule {}