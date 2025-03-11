import { Client, ClientProps } from "@/domain/entities/client"
import { PrismaClientMapper } from "@/infra/database/prisma/mappers/prima-client-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import { makeClient } from "../make-client"

@Injectable()
export class ClientFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaClient(data: Partial<ClientProps> = {}): Promise<Client> {
		const client = makeClient(data)

		await this.prisma.user.create({
			data: PrismaClientMapper.toPrisma(client),
		})

		return client
	}
}
