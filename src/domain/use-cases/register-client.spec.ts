import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { RegisterClientUseCase } from "./register-client"

let inMemoryClientsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let sut: RegisterClientUseCase

describe("Register Client", () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		fakeHasher = new FakeHasher()
		sut = new RegisterClientUseCase(inMemoryClientsRepository, fakeHasher)
	})

	it("should be able to register a new client", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "johndoe@mail.com",
			password: "123456",
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			client: inMemoryClientsRepository.items[0],
		})
	})

	it("should hash client password upon registration", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "johndoe@mail.com",
			password: "123456",
		})

		const hashedPassword = await fakeHasher.hash("123456")

		expect(result.isRight).toBeTruthy()
		expect(inMemoryClientsRepository.items[0].password).toEqual(hashedPassword)
	})
})
