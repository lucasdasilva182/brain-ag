import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCulturaDto {
  @ApiProperty({ example: 'Café' })
  @IsString()
  @IsNotEmpty()
  nome: string;
}
