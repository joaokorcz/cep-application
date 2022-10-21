import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateUserInputDto } from './dto/create-user-input.dto';
import { CreateUserOutputDto } from './dto/create-user-output.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiOperation({ description: 'Create new user' })
    @ApiOkResponse({ description: 'User created', type: CreateUserOutputDto })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @ApiUnprocessableEntityResponse({ description: 'Email already registered' })
    async create(@Body() createUserInput: CreateUserInputDto) {
        return this.usersService.create(createUserInput);
    }
}
