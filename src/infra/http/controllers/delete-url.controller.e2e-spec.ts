import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { ClientFactory } from "test/factories/make-client"
import { UrlFactory } from "test/factories/make-url"

describe("Delete url (e2e)", () => {
	let app: INestApplication
	let clientFactory: ClientFactory
	let urlFactory: UrlFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ClientFactory, UrlFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		prisma = moduleRef.get(PrismaService)
		clientFactory = moduleRef.get(ClientFactory)
		urlFactory = moduleRef.get(UrlFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test("[DELETE] /urls/:id", async () => {
		const user = await clientFactory.makePrismaClient()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const url = await urlFactory.makePrismaUrl({
			clientId: user.id,
			originalUrl: "https://test-url1.com",
		})

		const urlId = url.id.toString()

		const response = await request(app.getHttpServer())
			.delete(`/urls/${urlId}`)
			.set("Authorization", `Bearer ${accessToken}`)

		expect(response.statusCode).toBe(204)

		const urlOnDatabase = await prisma.url.findUnique({
			where: {
				id: urlId,
			},
		})

		expect(urlOnDatabase?.deletedAt).toBeTruthy()
	})
})
