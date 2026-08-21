import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class CulturaDto {
  @ApiProperty({ example: 'Soja' })
  @IsString()
  @IsNotEmpty()
  nome: string;
}

export class CreateSafraDto {
  @ApiProperty({ example: 'uuid-da-propriedade' })
  @IsString()
  @IsNotEmpty()
  propriedadeId: string;

  @ApiProperty({ example: 2022 })
  @IsInt()
  @Min(1900)
  ano: number;

  @ApiProperty({
    type: [CulturaDto],
    example: [{ nome: 'Soja' }, { nome: 'Milho' }],
    required: false,
    description: 'Culturas plantadas já cadastradas junto com a safra (opcional)',
  })
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => CulturaDto)
  culturas?: CulturaDto[];
}
