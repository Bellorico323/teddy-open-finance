import { Url, UrlProps } from "@/domain/entities/url"
import { PrismaUrlMapper } from "@/infra/database/prisma/mappers/prisma-url-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import { makeUrl } from "../make-url"

@Injectable()
export class UrlFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaUrl(data: Partial<UrlProps> = {}): Promise<Url> {
		const url = makeUrl(data)

		await this.prisma.url.create({
			data: PrismaUrlMapper.toPrisma(url),
		})

		return url
	}
}
