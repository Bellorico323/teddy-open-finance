import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { AppModule } from "./app.module"
import { EnvService } from "./env/env.service"

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	const envService = app.get(EnvService)
	const port = envService.get("PORT")

	await app.listen(port)
}

bootstrap()
