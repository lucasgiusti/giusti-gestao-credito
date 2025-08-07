import { Module } from '@nestjs/common';
import { IUserRepository } from '../interfaces/repositories/user.repository.interface';
import { UserValidationsSetup } from './setup/user-validations.setup';
import { CarteiraValidationsSetup } from './setup/carteira-validations.setup';
import { ICarteiraRepository } from '../interfaces/repositories/carteira.repository.interface';
import { IProcessoRepository } from '../interfaces/repositories/processo.repository.interface';
import { ICedenteRepository } from '../interfaces/repositories/cedente.repository.interface';
import { CedenteValidationsSetup } from './setup/cedente-validations.setup';
import { IParteProcessoRepository } from '../interfaces/repositories/parte-processo.repository.interface';
import { ProcessoValidationsSetup } from './setup/processo-validations.setup';
import { ParteProcessoValidationsSetup } from './setup/parte-processo-validations.setup';

@Module({
  providers: [
    {
      provide: 'VALIDATIONS_INIT',
      useFactory: (userRepository: IUserRepository, carteiraRepository: ICarteiraRepository, processoRepository: IProcessoRepository, cedenteRepository: ICedenteRepository, parteProcessoRepository: IParteProcessoRepository) => {
        UserValidationsSetup.initialize(userRepository);
        CarteiraValidationsSetup.initialize(carteiraRepository, processoRepository);
        CedenteValidationsSetup.initialize(cedenteRepository, parteProcessoRepository);
        ProcessoValidationsSetup.initialize(processoRepository, carteiraRepository, parteProcessoRepository);
        ParteProcessoValidationsSetup.initialize(parteProcessoRepository, cedenteRepository);
        return true;
      },
      inject: [IUserRepository, ICarteiraRepository, IProcessoRepository, ICedenteRepository, IParteProcessoRepository],
    },
  ],
  exports: ['VALIDATIONS_INIT'],
})
export class ValidationsModule {}