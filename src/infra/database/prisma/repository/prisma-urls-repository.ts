import { PaginationParams } from "@/core/repositories/pagination-params"
import { Url } from "@/domain/entities/url"
import { UrlsRepository } from "@/domain/repositories/urls-repository"
import { Injectable } from "@nestjs/common"
import { PrismaUrlMapper } from "../mappers/prisma-url-mapper"
import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaUrlsRepository implements UrlsRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string): Promise<Url | null> {
		const url = await this.prisma.url.findFirst({
			where: {
				id,
				deletedAt: null,
			},
		})

		if (!url) {
			return null
		}

		return PrismaUrlMapper.toDomain(url)
	}

	async findManyByClientId(
		clientId: string,
		{ page }: PaginationParams,
	): Promise<Url[]> {
		const urls = await this.prisma.url.findMany({
			where: {
				deletedAt: null,
				userId: clientId,
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return urls.map(PrismaUrlMapper.toDomain)
	}

	async findByShortCode(shortCode: string): Promise<Url | null> {
		const url = await this.prisma.url.findFirst({
			where: {
				shortCode,
				deletedAt: null,
			},
		})

		if (!url) {
			return null
		}

		return PrismaUrlMapper.toDomain(url)
	}

	async save(url: Url): Promise<void> {
		const data = PrismaUrlMapper.toPrisma(url)

		await this.prisma.url.update({
			data,
			where: {
				id: url.id.toString(),
			},
		})
	}

	async create(url: Url): Promise<void> {
		const data = PrismaUrlMapper.toPrisma(url)

		await this.prisma.url.create({
			data,
		})
	}

	async delete(url: Url): Promise<void> {
		await this.prisma.url.update({
			data: {
				deletedAt: new Date(),
			},
			where: {
				id: url.id.toString(),
			},
		})
	}
}
