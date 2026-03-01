import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('kycStatus') kycStatus?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({ role, status, kycStatus, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get user details with wallet, groups, nominees' })
  getUserDetails(@Param('id') id: string) {
    return this.usersService.getUserDetails(id);
  }

  @Get(':id/wallet')
  @ApiOperation({ summary: 'Get user wallet' })
  getUserWallet(@Param('id') id: string) {
    return this.usersService.getUserWallet(id);
  }

  @Get(':id/groups')
  @ApiOperation({ summary: 'Get user group memberships' })
  getUserGroups(@Param('id') id: string) {
    return this.usersService.getUserGroups(id);
  }

  @Get(':id/nominees')
  @ApiOperation({ summary: 'Get user nominees' })
  getUserNominees(@Param('id') id: string) {
    return this.usersService.getUserNominees(id);
  }

  @Get(':id/contributions')
  @ApiOperation({ summary: 'Get user contribution history' })
  getUserContributions(@Param('id') id: string) {
    return this.usersService.getUserContributions(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('super_admin', 'support_admin')
  @ApiOperation({ summary: 'Update user status (block/unblock/suspend)' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, updateStatusDto.status);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiOperation({ summary: 'Update user role' })
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, updateRoleDto.role);
  }

  @Post('export-all')
  @UseGuards(RolesGuard)
  @Roles('super_admin', 'finance_admin', 'support_admin')
  @ApiOperation({ summary: 'Export all users data' })
  exportAllUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('kycStatus') kycStatus?: string,
  ) {
    return this.usersService.exportAllUsers({ role, status, kycStatus });
  }

  @Post(':id/export')
  @UseGuards(RolesGuard)
  @Roles('super_admin', 'finance_admin', 'support_admin')
  @ApiOperation({ summary: 'Export user data' })
  exportUserData(@Param('id') id: string) {
    return this.usersService.exportUserData(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
