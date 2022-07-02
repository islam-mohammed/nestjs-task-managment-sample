import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TransformToPlainIntersceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,
    logger:
      process.env.STAGE !== 'prod'
        ? ['error', 'warn', 'debug', 'log', 'verbose']
        : ['error', 'warn'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformToPlainIntersceptor());
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('APP_PORT');
  await app.listen(port);
  // logger.log(`application listening to port ${port}`);
}
bootstrap();
