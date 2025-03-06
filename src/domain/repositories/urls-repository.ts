import type { PaginationParams } from "@/core/repositories/pagination-params"
import type { Url } from "../entities/url"

export abstract class UrlsRepository {
	abstract findById(id: string): Promise<Url | null>
	abstract findManyByClientId(
		clientId: string,
		params: PaginationParams,
	): Promise<Url[]>
	abstract findByShortCode(shortCode: string): Promise<Url | null>
	abstract save(url: Url): Promise<void>
	abstract create(url: Url): Promise<void>
	abstract delete(url: Url): Promise<void>
}
