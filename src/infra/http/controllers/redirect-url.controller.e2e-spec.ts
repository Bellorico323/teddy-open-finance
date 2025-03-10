import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { ClientFactory } from "test/factories/make-client"
import { UrlFactory } from "test/factories/make-url"

describe("Redirect url (e2e)", () => {
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

	test("[GET] /urls/redirect/:shotCode", async () => {
		const user = await clientFactory.makePrismaClient()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const url = await urlFactory.makePrismaUrl({
			clientId: user.id,
			originalUrl: "https://test-url1.com",
		})

		const shortCode = url.shortCode.value

		const response = await request(app.getHttpServer())
			.get(`/urls/redirect/${shortCode}`)
			.set("Authorization", `Bearer ${accessToken}`)

		expect(response.statusCode).toBe(302)
		expect(response.header.location).toBe("https://test-url1.com")

		const urlOnDatabase = await prisma.url.findUnique({
			where: {
				id: url.id.toString(),
			},
		})

		expect(urlOnDatabase?.deletedAt).toBeNull()
		expect(urlOnDatabase?.clickCount).toEqual(1)
	})
})
