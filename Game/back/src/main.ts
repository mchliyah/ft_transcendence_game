import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  patchNestJsSwagger();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
    allowedHeaders: 'Authorization, Content-Type',
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  const config = new DocumentBuilder()
    .setTitle('ft_transcendence API')
    .setDescription('Showing all the routes of the API')
    .setVersion('1.0')
    .addTag('ft_transcendence')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
