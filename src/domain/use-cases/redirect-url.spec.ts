import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { makeUrl } from "test/factories/make-url"
import { InMemoryUrlsRepository } from "test/repositories/in-memory-urls-repository"
import { RedirectUrlUseCase } from "./redirect-url"

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: RedirectUrlUseCase

describe("Redirect URL", () => {
	beforeEach(() => {
		inMemoryUrlsRepository = new InMemoryUrlsRepository()
		sut = new RedirectUrlUseCase(inMemoryUrlsRepository)
	})

	it("should redirect to the original URL given a valid short code", async () => {
		const newUrl = makeUrl(
			{
				clientId: new UniqueEntityID("client-1"),
				originalUrl: "https://url-test.com",
			},
			new UniqueEntityID("url-1"),
		)

		await inMemoryUrlsRepository.create(newUrl)

		await sut.execute({
			shortCode: newUrl.shortCode.value,
		})

		expect(inMemoryUrlsRepository.items[0]).toMatchObject({
			originalUrl: "https://url-test.com",
		})
	})

	it("should be able to increment click count when redirects", async () => {
		const newUrl = makeUrl(
			{
				clientId: new UniqueEntityID("client-1"),
				originalUrl: "https://url-test.com",
			},
			new UniqueEntityID("url-1"),
		)

		await inMemoryUrlsRepository.create(newUrl)

		await sut.execute({
			shortCode: newUrl.shortCode.value,
		})

		expect(inMemoryUrlsRepository.items[0].clickCount).toBe(1)

		await sut.execute({
			shortCode: newUrl.shortCode.value,
		})

		expect(inMemoryUrlsRepository.items[0].clickCount).toBe(2)
	})

	it("should not be able to redirect from an invalid short code", async () => {
		const invalidShortCode = "nonexistent123"

		const result = await sut.execute({
			shortCode: invalidShortCode,
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
