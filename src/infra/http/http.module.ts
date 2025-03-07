import { RegisterClientUseCase } from "@/domain/use-cases/register-client"
import { Module } from "@nestjs/common"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { DatabaseModule } from "../database/database.module"
import { CreateAccountController } from "./controllers/create-account.controller"

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [CreateAccountController],
	providers: [RegisterClientUseCase],
})
export class HttpModule {}
