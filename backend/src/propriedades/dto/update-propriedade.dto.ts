import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePropriedadeDto } from './create-propriedade.dto';

// produtorId é imutável aqui — trocar de dono exige excluir e recriar.
export class UpdatePropriedadeDto extends PartialType(
  OmitType(CreatePropriedadeDto, ['produtorId'] as const),
) {}
