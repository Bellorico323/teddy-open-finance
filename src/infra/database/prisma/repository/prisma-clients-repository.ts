import type { ClientsRepository } from "@/domain/repositories/clients-repository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PrismaStudentsRepository implements ClientsRepository {}
