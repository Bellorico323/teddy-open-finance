import type { Url } from "@/domain/entities/url"
import type { UrlsRepository } from "@/domain/repositories/urls-repository"

export class InMemoryUrlsRepository implements UrlsRepository {
	public items: Url[] = []

	async findById(id: string): Promise<Url | null> {
		const url = this.items.find((url) => url.id.toString() === id)

		if (!url) {
			return null
		}

		return url
	}

	async save(url: Url): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === url.id)

		this.items[itemIndex] = url
	}

	async create(url: Url): Promise<void> {
		this.items.push(url)
	}
}
