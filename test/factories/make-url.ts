import type { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Url, type UrlProps } from "@/domain/entities/url"
import { faker } from "@faker-js/faker"

export function makeUrl(override: Partial<UrlProps> = {}, id?: UniqueEntityID) {
	const client = Url.create(
		{
			originalUrl: faker.internet.url(),
			clickCount: 0,
			...override,
		},
		id,
	)

	return client
}
