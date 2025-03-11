import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express"
import { IS_PUBLIC_KEY } from "./public"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor(private reflector: Reflector) {
		super()
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (isPublic) {
			const request: Request = context.switchToHttp().getRequest()

			if (request.headers.authorization) {
				return super.canActivate(context)
			}

			return true
		}
		return super.canActivate(context)
	}
}
