import { InMemoryUrlsRepository } from "test/repositories/in-memory-urls-repository"
import { CreateUrlUseCase } from "./create-url"

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: CreateUrlUseCase

describe("Create URL", () => {
	beforeEach(() => {
		inMemoryUrlsRepository = new InMemoryUrlsRepository()
		sut = new CreateUrlUseCase(inMemoryUrlsRepository)
	})

	it("should be able to create a URL without being authenticated", async () => {
		const result = await sut.execute({
			originalUrl: "https://test-url.com",
		})

		expect(result.isRight()).toBe(true)
		expect(result.value.url.clientId).toBeNull()
		expect(inMemoryUrlsRepository.items[0].originalUrl).toEqual(
			"https://test-url.com",
		)
	})

	it("should be able to create a URL and save the user ID from authenticated user", async () => {
		const result = await sut.execute({
			originalUrl: "https://test-url.com",
			clientId: "1",
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryUrlsRepository.items[0].clientId.toValue()).toEqual("1")
	})

	it("should be able to create a short code for URL", async () => {
		const result = await sut.execute({
			originalUrl: "https://test-url.com",
			clientId: "1",
		})

		expect(result.isRight()).toBeTruthy()
		expect(inMemoryUrlsRepository.items[0].shortCode.value).toHaveLength(6)
	})
})
