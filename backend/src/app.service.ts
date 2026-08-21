import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      nome: 'Brain Agriculture API',
      versao: '1.0.0',
      documentacao: '/docs',
      healthCheck: '/health',
    };
  }
}
