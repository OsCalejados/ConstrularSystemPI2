import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

dotenv.config();
const backendPort = process.env.BACKEND_PORT ?? 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpAdapterHost)));
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'https://constrularfront.netlify.app',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Soficit API')
    .setDescription(
      'Essa catálogo de métodos de API tem como objetivo documentar todos os endpoints do backend do Constrular System',
    )
    .setVersion('1.0')
    .addTag('Constrular System')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(backendPort);
}

bootstrap().then(
  () => {
    Logger.log(`Server is running in http://localhost:${backendPort}/`);
    Logger.log(`Swagger is running in http://localhost:${backendPort}/docs`);
  },
  (err) => Logger.error(err),
);
