import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { EnvService } from "./env/env.service"

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	const envService = app.get(EnvService)

	const allowedOrigins = envService.get("CORS_ALLOWED_ORIGINS")
		? envService.get("CORS_ALLOWED_ORIGINS").split(",")
		: ""

	app.enableCors({
		origin: allowedOrigins,
		allowedHeaders: "Content-Type,Authorization",
	})

	const config = new DocumentBuilder()
		.setTitle("Teddy Open Finance")
		.setDescription("API para o sistema Teddy Open Finance")
		.setVersion("1.0")
		.addTag("auth")
		.addTag("url")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
			"access-token",
		)
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup("api", app, documentFactory)

	const port = envService.get("PORT")

	await app.listen(port)
}

bootstrap()
