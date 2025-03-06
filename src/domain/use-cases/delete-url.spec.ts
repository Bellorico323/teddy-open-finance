import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { makeUrl } from "test/factories/make-url"
import { InMemoryUrlsRepository } from "test/repositories/in-memory-urls-repository"
import { DeleteUrlUseCase } from "./delete-url"

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: DeleteUrlUseCase

describe("Delete URL", () => {
	beforeEach(() => {
		inMemoryUrlsRepository = new InMemoryUrlsRepository()
		sut = new DeleteUrlUseCase(inMemoryUrlsRepository)
	})

	it("should be able to delete a URL", async () => {
		const newUrl = makeUrl(
			{
				clientId: new UniqueEntityID("client-1"),
			},
			new UniqueEntityID("url-1"),
		)

		await inMemoryUrlsRepository.create(newUrl)

		await sut.execute({
			clientId: "client-1",
			urlId: "url-1",
		})

		expect(inMemoryUrlsRepository.items[0].deletedAt).toBeTruthy()
		expect(inMemoryUrlsRepository.items[0].deletedAt).toEqual(expect.any(Date))
	})

	it("should not be able to delete a URL from another client", async () => {
		const newUrl = makeUrl(
			{
				clientId: new UniqueEntityID("client-1"),
			},
			new UniqueEntityID("url-1"),
		)

		await inMemoryUrlsRepository.create(newUrl)

		const result = await sut.execute({
			clientId: "client-2",
			urlId: "url-1",
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
