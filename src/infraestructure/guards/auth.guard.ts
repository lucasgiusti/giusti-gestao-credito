import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticatedUser } from "src/domain/entities/authenticated-user";
import { SupabaseService } from "../config/supabase.config";
import { UserRole, UserStatus } from "src/domain/entities/user";

export const REQUEST_CONTEXT = '_requestContext';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private supabaseService: SupabaseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = context.getArgs()[0]?.headers?.authorization?.split(' ')[1];
        console.log('----token');
        console.log(token);
        console.log('----token');
        if (!token) {
            throw new UnauthorizedException('unauthorized.token.not.provided');
        }

        const permissions = this.reflector.get<string[]>("permissions", context.getHandler());
        try {
            const { data, error } = await this.supabaseService.getClient().auth.getUser(token);
            
            if (error) {
                throw new UnauthorizedException('error.on.authentication');
            }
            
            if (!data.user) {
                throw new UnauthorizedException('unauthorized.user.not.found');
            }

            if (!data.user.user_metadata?.status) {
                throw new UnauthorizedException('unauthorized.user.has.not.been.authorized.by.admin');
            }

            if (data.user.user_metadata?.status !== UserStatus.ACTIVE) {
                throw new UnauthorizedException('unauthorized.user.is.not.active.or.has.not.been.authorized.by.admin');
            }

            if (permissions && permissions.length > 0 && !permissions.includes(data.user.user_metadata?.role as UserRole)) {
                throw new UnauthorizedException('unauthorized');
            }

            const user: AuthenticatedUser = { 
                id: data.user.id,
                email: data.user.email,
                userRole: data.user.user_metadata?.role as UserRole,
                status: data.user.user_metadata?.status as UserStatus,
            };
            
            request.user = user;

            return true;
        } catch (error) {
            throw error;
        }
    }
}