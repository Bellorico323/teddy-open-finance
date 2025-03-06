import { type Either, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Injectable } from "@nestjs/common"
import { Url } from "../entities/url"
import type { UrlsRepository } from "../repositories/urls-repository"

interface CreateUrlUseCaseRequest {
	originalUrl: string
	clientId?: string
}

type CreateUrlUseCaseResponse = Either<
	null,
	{
		url: Url
	}
>

@Injectable()
export class CreateUrlUseCase {
	constructor(private urlsRepository: UrlsRepository) {}

	async execute({
		originalUrl,
		clientId,
	}: CreateUrlUseCaseRequest): Promise<CreateUrlUseCaseResponse> {
		const url = Url.create({
			originalUrl,
			clientId: clientId ? new UniqueEntityID(clientId) : null,
			clickCount: 0,
		})

		await this.urlsRepository.create(url)

		return right({
			url,
		})
	}
}
