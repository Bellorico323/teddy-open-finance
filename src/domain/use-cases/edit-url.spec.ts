import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { makeUrl } from "test/factories/make-url"
import { InMemoryUrlsRepository } from "test/repositories/in-memory-urls-repository"
import { EditUrlUseCase } from "./edit-url"

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: EditUrlUseCase

describe("Edit URL", () => {
	beforeEach(() => {
		inMemoryUrlsRepository = new InMemoryUrlsRepository()
		sut = new EditUrlUseCase(inMemoryUrlsRepository)
	})

	it("should be able to edit a URL", async () => {
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
			originalUrl: "https://edited-url.com",
		})

		expect(inMemoryUrlsRepository.items[0]).toMatchObject({
			originalUrl: "https://edited-url.com",
		})
	})

	it("should not be able to edit a URL from another client", async () => {
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
			originalUrl: "https://edited-url.com",
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
