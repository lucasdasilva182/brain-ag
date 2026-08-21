import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsCpfCnpj } from '../../common/validators/is-cpf-cnpj.decorator';

export class CreateProdutorDto {
  @ApiProperty({ example: '111.444.777-35', description: 'CPF ou CNPJ do produtor' })
  @IsString()
  @IsCpfCnpj({ message: 'CPF ou CNPJ inválido' })
  documento: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string;
}
