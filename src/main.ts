import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Parser } from "./parser/parser";
import { HttpService } from "@nestjs/axios";


async function bootstrap() {

  const PORT = process.env.PORT || 5000;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  const parser = new Parser(new HttpService)
  setInterval(() => {
    parser.findItem()
  }, 5000)
}

bootstrap();
