import { type Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Url } from "../entities/url"
import { UrlsRepository } from "../repositories/urls-repository"

interface EditUrlUseCaseRequest {
	originalUrl: string
	clientId: string
	urlId: string
}

type EditUrlUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		url: Url
	}
>

@Injectable()
export class EditUrlUseCase {
	constructor(private urlsRepository: UrlsRepository) {}

	async execute({
		originalUrl,
		clientId,
		urlId,
	}: EditUrlUseCaseRequest): Promise<EditUrlUseCaseResponse> {
		const url = await this.urlsRepository.findById(urlId)

		if (!url) {
			return left(new ResourceNotFoundError())
		}

		if (!url.clientId || clientId !== url.clientId.toString()) {
			return left(new NotAllowedError())
		}

		url.originalUrl = originalUrl

		await this.urlsRepository.save(url)

		return right({
			url,
		})
	}
}
