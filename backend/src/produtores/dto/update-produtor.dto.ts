import { PartialType } from '@nestjs/swagger';
import { CreateProdutorDto } from './create-produtor.dto';

// PartialType pega o DTO de criação e torna todos os campos opcionais,
// mantendo as mesmas regras de validação quando o campo é enviado.
export class UpdateProdutorDto extends PartialType(CreateProdutorDto) {}
