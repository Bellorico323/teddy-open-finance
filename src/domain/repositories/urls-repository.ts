import type { Url } from "../entities/url"

export abstract class UrlsRepository {
	abstract findById(id: string): Promise<Url | null>
	abstract save(url: Url): Promise<void>
	abstract create(url: Url): Promise<void>
}
