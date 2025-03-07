import { ClientsRepository } from "@/domain/repositories/clients-repository"
import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaClientsRepository } from "./prisma/repository/prisma-clients-repository"

@Module({
	providers: [
		PrismaService,
		{
			provide: ClientsRepository,
			useClass: PrismaClientsRepository,
		},
	],
	exports: [PrismaService, ClientsRepository],
})
export class DatabaseModule {}
