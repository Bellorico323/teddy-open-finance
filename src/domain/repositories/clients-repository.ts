import { Client } from "../entities/client"

export abstract class ClientsRepository {
	abstract findByEmail(email: string): Promise<Client | null>
	abstract create(client: Client): Promise<void>
}
