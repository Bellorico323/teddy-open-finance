import { ClientsRepository } from "@/domain/repositories/clients-repository"
import { UrlsRepository } from "@/domain/repositories/urls-repository"
import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaClientsRepository } from "./prisma/repository/prisma-clients-repository"
import { PrismaUrlsRepository } from "./prisma/repository/prisma-urls-repository"

@Module({
	providers: [
		PrismaService,
		{
			provide: ClientsRepository,
			useClass: PrismaClientsRepository,
		},
		{
			provide: UrlsRepository,
			useClass: PrismaUrlsRepository,
		},
	],
	exports: [PrismaService, ClientsRepository, UrlsRepository],
})
export class DatabaseModule {}
