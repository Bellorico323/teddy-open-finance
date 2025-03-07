import { AuthenticateClientUseCase } from "@/domain/use-cases/authenticate-client"
import { CreateUrlUseCase } from "@/domain/use-cases/create-url"
import { RegisterClientUseCase } from "@/domain/use-cases/register-client"
import { Module } from "@nestjs/common"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { DatabaseModule } from "../database/database.module"
import { AuthenticateController } from "./controllers/authenticate.controller"
import { CreateAccountController } from "./controllers/create-account.controller"
import { CreateUrlController } from "./controllers/create-url.controller"

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateUrlController,
	],
	providers: [
		RegisterClientUseCase,
		AuthenticateClientUseCase,
		CreateUrlUseCase,
	],
})
export class HttpModule {}
