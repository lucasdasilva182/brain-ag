import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  @ApiOperation({
    summary:
      'Retorna totais gerais e dados para os gráficos de pizza (por estado, por cultura e uso do solo)',
  })
  getResumo() {
    return this.dashboardService.getResumo();
  }
}
