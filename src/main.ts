import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

const port = process.env.PORT;

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
  console.info(`SERVER IS RUNNING ON PORT: ${port}`);
})();
