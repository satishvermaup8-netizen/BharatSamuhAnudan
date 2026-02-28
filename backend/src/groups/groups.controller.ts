import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  findAll() { return this.groupsService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  findOne(@Param('id') id: string) { return this.groupsService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create new group' })
  create(@Body() createGroupDto: CreateGroupDto) { return this.groupsService.create(createGroupDto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) { return this.groupsService.update(id, updateGroupDto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  remove(@Param('id') id: string) { return this.groupsService.remove(id); }
}
