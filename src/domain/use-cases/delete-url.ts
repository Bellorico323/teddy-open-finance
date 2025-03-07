import { type Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Url } from "../entities/url"
import { UrlsRepository } from "../repositories/urls-repository"

interface DeleteUrlUseCaseRequest {
	clientId: string
	urlId: string
}

type DeleteUrlUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		url: Url
	}
>

@Injectable()
export class DeleteUrlUseCase {
	constructor(private urlsRepository: UrlsRepository) {}

	async execute({
		clientId,
		urlId,
	}: DeleteUrlUseCaseRequest): Promise<DeleteUrlUseCaseResponse> {
		const url = await this.urlsRepository.findById(urlId)

		if (!url) {
			return left(new ResourceNotFoundError())
		}

		if (!url.clientId || clientId !== url.clientId.toString()) {
			return left(new NotAllowedError())
		}

		await this.urlsRepository.delete(url)

		return right({
			url,
		})
	}
}
