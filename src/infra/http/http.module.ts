import { AuthenticateClientUseCase } from "@/domain/use-cases/authenticate-client"
import { CreateUrlUseCase } from "@/domain/use-cases/create-url"
import { DeleteUrlUseCase } from "@/domain/use-cases/delete-url"
import { EditUrlUseCase } from "@/domain/use-cases/edit-url"
import { FetchClientUrlsUseCase } from "@/domain/use-cases/fetch-client-urls"
import { RedirectUrlUseCase } from "@/domain/use-cases/redirect-url"
import { RegisterClientUseCase } from "@/domain/use-cases/register-client"
import { Module } from "@nestjs/common"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { DatabaseModule } from "../database/database.module"
import { AuthenticateController } from "./controllers/authenticate.controller"
import { CreateAccountController } from "./controllers/create-account.controller"
import { CreateUrlController } from "./controllers/create-url.controller"
import { DeleteUrlController } from "./controllers/delete-url.controller"
import { EditUrlController } from "./controllers/edit-url.controller"
import { FetchClientUrlsController } from "./controllers/fetch-client-urls.controller"
import { RedirectUrlController } from "./controllers/redirect-url.controller"

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateUrlController,
		FetchClientUrlsController,
		EditUrlController,
		DeleteUrlController,
		RedirectUrlController,
	],
	providers: [
		RegisterClientUseCase,
		AuthenticateClientUseCase,
		CreateUrlUseCase,
		FetchClientUrlsUseCase,
		EditUrlUseCase,
		DeleteUrlUseCase,
		RedirectUrlUseCase,
	],
})
export class HttpModule {}
