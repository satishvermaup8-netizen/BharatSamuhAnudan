import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Use a dummy hash for timing attack prevention when user not found
    // This ensures password comparison always runs to maintain constant-time response
    const DUMMY_HASH = '$2b$10$5GqFkC1yJmMCdKqCNlEzE.6Dz0eNQsN.F0UftZCZd1m0sKZz1l6eG';
    
    const user = await this.usersService.findByEmail(email);
    const hashToCompare = user?.password || DUMMY_HASH;
    
    // Always compare to prevent timing attacks that reveal if email exists
    const isValidPassword = await this.comparePassword(password, hashToCompare);
    
    if (user && isValidPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get('BCRYPT_ROUNDS', 10);
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Verify a refresh token and return its payload
   * @param token - The refresh token to verify
   * @returns The decoded token payload
   * @throws Error if token is invalid or expired
   */
  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  /**
   * Find a user by their ID
   * @param id - The user ID
   * @returns The user object or null if not found
   */
  async findUserById(id: string): Promise<any> {
    try {
      return await this.usersService.findOne(id);
    } catch {
      return null;
    }
  }
}
