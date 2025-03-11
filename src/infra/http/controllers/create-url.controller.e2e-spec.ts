import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { ClientFactory } from "test/factories/prisma/prisma-client-factory"

describe("Create url (e2e)", () => {
	let app: INestApplication
	let prisma: PrismaService
	let clientFactory: ClientFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ClientFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		clientFactory = moduleRef.get(ClientFactory)
		jwt = moduleRef.get(JwtService)
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	test("[POST] /urls", async () => {
		const response = await request(app.getHttpServer()).post("/urls").send({
			originalUrl: "https://test-url.com",
		})

		expect(response.statusCode).toBe(201)

		const urlOnDatabase = await prisma.url.findFirst({
			where: {
				originalUrl: "https://test-url.com",
			},
		})

		expect(urlOnDatabase).toBeTruthy()
		expect(urlOnDatabase?.userId).toBeNull()
	})

	test("[POST] /urls (authenticated)", async () => {
		const user = await clientFactory.makePrismaClient()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post("/urls")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				originalUrl: "https://test-url-authenticated.com",
			})

		expect(response.statusCode).toBe(201)

		const urlOnDatabase = await prisma.url.findFirst({
			where: {
				originalUrl: "https://test-url-authenticated.com",
			},
		})

		expect(urlOnDatabase).toBeTruthy()
		expect(urlOnDatabase?.userId).toEqual(user.id.toString())
	})
})
