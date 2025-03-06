import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeClient } from "test/factories/make-client"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { AuthenticateClientUseCase } from "./authenticate-client"

let inMemoryClientsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateClientUseCase

describe("Authenticate Client", () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		fakeHasher = new FakeHasher()
		fakeEncrypter = new FakeEncrypter()
		sut = new AuthenticateClientUseCase(
			inMemoryClientsRepository,
			fakeHasher,
			fakeEncrypter,
		)
	})

	it("should be able to authenticate a client", async () => {
		const client = makeClient({
			email: "johndoe@mail.com",
			password: await fakeHasher.hash("123456"),
		})

		inMemoryClientsRepository.items.push(client)

		const result = await sut.execute({
			email: "johndoe@mail.com",
			password: "123456",
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		})
	})
})
