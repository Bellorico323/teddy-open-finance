import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Url } from "@/domain/entities/url"
import { ShortCode } from "@/domain/entities/value-objects/short-code"
import { Prisma, Url as PrismaUrl } from "@prisma/client"

export class PrismaUrlMapper {
	static toDomain(raw: PrismaUrl): Url {
		return Url.create(
			{
				originalUrl: raw.originalUrl,
				shortCode: ShortCode.create(raw.shortCode),
				clickCount: raw.clickCount,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
				deletedAt: raw.deletedAt,
				clientId: raw.userId ? new UniqueEntityID(raw.userId) : null,
			},
			new UniqueEntityID(raw.id),
		)
	}

	static toPrisma(url: Url): Prisma.UrlUncheckedCreateInput {
		return {
			originalUrl: url.originalUrl,
			shortCode: url.shortCode.value,
			clickCount: url.clickCount,
			createdAt: url.createdAt,
			updatedAt: url.updatedAt,
			deletedAt: url.updatedAt,
			userId: url.clientId ? url.clientId.toString() : null,
		}
	}
}
