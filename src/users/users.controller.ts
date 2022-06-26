
import { Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Query, 
  Delete, 
  Patch, 
  NotFoundException,
  Session} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto'; 
import { AuthService } from './auth.service';

 
@Controller('auth')
@Serialize(UserDto)
export class UsersController {

  constructor(private userService: UsersService,
              private authService: AuthService) {}

  
  @Get('/colors/:color')            
  setColor(@Param('color') color: string, @Session() session: any) {

    session.color = color;
  }       
  
  @Get('/colors')
  getColor(@Session() session: any){

    return session.color;

  }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto){

    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  signIn(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  @Get('/getById/:id')
  async findUserById(@Param('id') id: string){
    const user =  await this.userService.findOne(parseInt(id));
    if(!user){
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) { 
    return this.userService.remove(parseInt(id));
  }

 
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id),  body);
  }
}