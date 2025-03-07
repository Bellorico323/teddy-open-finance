import { type Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { UrlsRepository } from "../repositories/urls-repository"

interface RedirectUrlUseCaseRequest {
	shortCode: string
}

type RedirectUrlUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		originalUrl: string
	}
>

@Injectable()
export class RedirectUrlUseCase {
	constructor(private urlsRepository: UrlsRepository) {}

	async execute({
		shortCode,
	}: RedirectUrlUseCaseRequest): Promise<RedirectUrlUseCaseResponse> {
		const url = await this.urlsRepository.findByShortCode(shortCode)

		if (!url) {
			return left(new ResourceNotFoundError())
		}

		url.countClick()

		await this.urlsRepository.save(url)

		return right({
			originalUrl: url.originalUrl,
		})
	}
}
