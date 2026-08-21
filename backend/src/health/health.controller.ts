import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary:
      'Verifica se a aplicação e a conexão com o banco de dados estão saudáveis. Usado por orquestradores (Docker, Kubernetes) para monitoramento.',
  })
  check() {
    return this.health.check([() => this.checkDatabase()]);
  }

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      // Consulta mínima só para confirmar que a conexão com o Postgres
      // está respondendo — não depende de nenhuma tabela existir.
      await this.prisma.$queryRaw`SELECT 1`;
      return { database: { status: 'up' } };
    } catch (error) {
      throw new HealthCheckError('Falha na conexão com o banco de dados', {
        database: { status: 'down', message: (error as Error).message },
      });
    }
  }
}
