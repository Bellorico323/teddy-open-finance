import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Url, type UrlProps } from "@/domain/entities/url"
import { PrismaUrlMapper } from "@/infra/database/prisma/mappers/prisma-url-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeUrl(override: Partial<UrlProps> = {}, id?: UniqueEntityID) {
	const client = Url.create(
		{
			originalUrl: faker.internet.url(),
			clickCount: 0,
			...override,
		},
		id,
	)

	return client
}

@Injectable()
export class UrlFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaClient(data: Partial<UrlProps> = {}): Promise<Url> {
		const url = makeUrl(data)

		await this.prisma.url.create({
			data: PrismaUrlMapper.toPrisma(url),
		})

		return url
	}
}
