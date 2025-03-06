// import { UniqueEntityID } from "@/core/entities/unique-entity-id"
// import { Client } from "@/domain/entities/client"

// export class PrismaClientMapper {
// 	static toDomain(raw: any): Client {
// 		return Client.create(
// 			{
// 				name: raw.name,
// 				email: raw.email,
// 				password: raw.password,
// 			},
// 			new UniqueEntityID(raw.id),
// 		)
// 	}
// }
