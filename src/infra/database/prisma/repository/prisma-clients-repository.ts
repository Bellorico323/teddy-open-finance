import { Client } from "@/domain/entities/client"
import { ClientsRepository } from "@/domain/repositories/clients-repository"
import { Injectable } from "@nestjs/common"
import { PrismaClientMapper } from "../mappers/prima-client-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
	constructor(private prisma: PrismaService) {}

	async findByEmail(email: string): Promise<Client | null> {
		const client = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!client) {
			return null
		}

		return PrismaClientMapper.toDomain(client)
	}

	async create(client: Client): Promise<void> {
		const data = PrismaClientMapper.toPrisma(client)

		await this.prisma.user.create({
			data,
		})
	}
}
