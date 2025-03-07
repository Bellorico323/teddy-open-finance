import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Client, type ClientProps } from "@/domain/entities/client"
import { faker } from "@faker-js/faker"

export function makeClient(
	override: Partial<ClientProps> = {},
	id?: UniqueEntityID,
) {
	const client = Client.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id,
	)

	return client
}
