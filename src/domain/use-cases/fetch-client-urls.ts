import { type Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Url } from "../entities/url"
import { UrlsRepository } from "../repositories/urls-repository"

interface FetchClientUrlsUseCaseRequest {
	clientId: string
	page: number
}

type FetchClientUrlsUseCaseResponse = Either<
	null,
	{
		urls: Url[]
	}
>

@Injectable()
export class FetchClientUrlsUseCase {
	constructor(private urlsRepository: UrlsRepository) {}

	async execute({
		clientId,
		page,
	}: FetchClientUrlsUseCaseRequest): Promise<FetchClientUrlsUseCaseResponse> {
		const urls = await this.urlsRepository.findManyByClientId(clientId, {
			page,
		})

		return right({
			urls,
		})
	}
}
