import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" }); // todo
  await app.listen(5000, {host: "0.0.0.0"});
}
bootstrap();
