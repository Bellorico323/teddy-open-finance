import { type Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { HashGenerator } from "../criptography/hash-generator"
import { Client } from "../entities/client"
import { ClientsRepository } from "../repositories/clients-repository"
import { ClientAlreadyExistsError } from "./errors/client-already-exists-error"

interface RegisterClientUseCaseRequest {
	name: string
	email: string
	password: string
}

type RegisterClientUseCaseResponse = Either<
	ClientAlreadyExistsError,
	{
		client: Client
	}
>

@Injectable()
export class RegisterClientUseCase {
	constructor(
		private clientsRepository: ClientsRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		email,
		password,
	}: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
		const clientWithSameEmail = await this.clientsRepository.findByEmail(email)

		if (clientWithSameEmail) {
			return left(new ClientAlreadyExistsError(email))
		}

		const hashedPassword = await this.hashGenerator.hash(password)

		const client = Client.create({
			name,
			email,
			password: hashedPassword,
		})

		await this.clientsRepository.create(client)

		return right({
			client,
		})
	}
}
