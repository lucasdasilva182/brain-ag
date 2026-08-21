import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePropriedadeDto } from './create-propriedade.dto';

// Não deixamos trocar o produtorId numa atualização — se precisar disso,
// o correto é excluir e recriar, pra não gerar inconsistência de dono.
export class UpdatePropriedadeDto extends PartialType(
  OmitType(CreatePropriedadeDto, ['produtorId'] as const),
) {}
