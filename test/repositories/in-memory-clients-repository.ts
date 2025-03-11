import { Client } from "@/domain/entities/client"
import { ClientsRepository } from "@/domain/repositories/clients-repository"

export class InMemoryClientsRepository implements ClientsRepository {
	public items: Client[] = []

	async findByEmail(email: string) {
		const client = this.items.find((item) => item.email === email)

		if (!client) {
			return null
		}

		return client
	}

	async create(client: Client) {
		this.items.push(client)
	}
}
