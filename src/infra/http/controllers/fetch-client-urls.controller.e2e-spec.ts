import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { ClientFactory } from "test/factories/make-client"
import { UrlFactory } from "test/factories/make-url"

describe("Fetch client urls (e2e)", () => {
	let app: INestApplication
	let clientFactory: ClientFactory
	let urlFactory: UrlFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ClientFactory, UrlFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		clientFactory = moduleRef.get(ClientFactory)
		urlFactory = moduleRef.get(UrlFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test("[GET] /urls", async () => {
		const user = await clientFactory.makePrismaClient()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		await Promise.all([
			urlFactory.makePrismaUrl({
				clientId: user.id,
				originalUrl: "https://test-url1.com",
			}),
			urlFactory.makePrismaUrl({
				clientId: user.id,
				originalUrl: "https://test-url2.com",
			}),
		])

		const response = await request(app.getHttpServer())
			.get("/urls")
			.set("Authorization", `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			urls: expect.arrayContaining([
				expect.objectContaining({ originalUrl: "https://test-url1.com" }),
				expect.objectContaining({ originalUrl: "https://test-url2.com" }),
			]),
		})
	})
})
