import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePropriedadeDto {
  @ApiProperty({ example: 'uuid-do-produtor' })
  @IsString()
  @IsNotEmpty()
  produtorId: string;

  @ApiProperty({ example: 'Fazenda Boa Vista' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Uberlândia' })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({ example: 'MG', description: 'Sigla do estado (UF)' })
  @IsString()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @IsPositive()
  areaTotal: number;

  @ApiProperty({ example: 90 })
  @IsNumber()
  @Min(0)
  areaAgricultavel: number;

  @ApiProperty({ example: 40 })
  @IsNumber()
  @Min(0)
  areaVegetacao: number;
}
