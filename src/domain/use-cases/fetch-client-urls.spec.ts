import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeUrl } from "test/factories/make-url"
import { InMemoryUrlsRepository } from "test/repositories/in-memory-urls-repository"
import { FetchClientUrlsUseCase } from "./fetch-client-urls"

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: FetchClientUrlsUseCase

describe("Fetch Client URLs", () => {
	beforeEach(() => {
		inMemoryUrlsRepository = new InMemoryUrlsRepository()
		sut = new FetchClientUrlsUseCase(inMemoryUrlsRepository)
	})

	it("should be able to fetch client URLs", async () => {
		for (let i = 0; i < 3; i++) {
			await inMemoryUrlsRepository.create(
				makeUrl({
					clientId: new UniqueEntityID("client-1"),
				}),
			)
		}

		const result = await sut.execute({
			clientId: "client-1",
			page: 1,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value.urls).toHaveLength(3)
	})

	it("should be able to fetch paginated URLs", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryUrlsRepository.create(
				makeUrl({
					clientId: new UniqueEntityID("client-1"),
				}),
			)
		}

		const result = await sut.execute({
			clientId: "client-1",
			page: 2,
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value.urls).toHaveLength(2)
	})

	it("should not be able to fetch deleted URLs", async () => {
		for (let i = 1; i <= 3; i++) {
			await inMemoryUrlsRepository.create(
				makeUrl({
					clientId: new UniqueEntityID("client-1"),
				}),
			)
		}

		await inMemoryUrlsRepository.create(
			makeUrl({
				clientId: new UniqueEntityID("client-1"),
				deletedAt: new Date(),
			}),
		)

		const result = await sut.execute({
			clientId: "client-1",
			page: 1,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value.urls).toHaveLength(3)
	})
})
