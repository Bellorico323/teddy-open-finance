import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs"
import request from "supertest"
import { ClientFactory } from "test/factories/make-client"

describe("Authenticate (e2e)", () => {
	let app: INestApplication
	let clientFactory: ClientFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ClientFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		clientFactory = moduleRef.get(ClientFactory)

		await app.init()
	})

	test("[POST] /sessions", async () => {
		await clientFactory.makePrismaClient({
			email: "johndoe@example.com",
			password: await hash("123456", 8),
		})

		const response = await request(app.getHttpServer()).post("/sessions").send({
			email: "johndoe@example.com",
			password: "123456",
		})

		expect(response.statusCode).toBe(201)
		expect(response.body).toEqual({
			access_token: expect.any(String),
		})
	})
})
