import { PaginationParams } from "@/core/repositories/pagination-params"
import { Url } from "@/domain/entities/url"
import { UrlsRepository } from "@/domain/repositories/urls-repository"

export class InMemoryUrlsRepository implements UrlsRepository {
	public items: Url[] = []

	async findById(id: string): Promise<Url | null> {
		const url = this.items.find(
			(url) => !url.deletedAt && url.id.toString() === id,
		)

		if (!url) {
			return null
		}

		return url
	}

	async findManyByClientId(
		clientId: string,
		{ page }: PaginationParams,
	): Promise<Url[]> {
		const urls = this.items
			.filter(
				(item) => !item.deletedAt && item.clientId.toString() === clientId,
			)
			.slice((page - 1) * 20, page * 20)

		return urls
	}

	async save(url: Url): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === url.id)

		this.items[itemIndex] = url
	}

	async create(url: Url): Promise<void> {
		this.items.push(url)
	}

	async delete(url: Url): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === url.id)

		url.delete()

		this.items[itemIndex] = url
	}

	async findByShortCode(shortCode: string): Promise<Url | null> {
		const url = this.items.find(
			(url) => !url.deletedAt && url.shortCode.value === shortCode,
		)

		if (!url) {
			return null
		}

		return url
	}
}
