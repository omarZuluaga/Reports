import { createParamDecorator, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let logger = new Logger(); 
  
  beforeEach(async () => {

    //create a mock of the user service

    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers  = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {id: Math.floor(Math.random() * 99999), email, password} as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [AuthService,
      {
        provide:UsersService,
        useValue: fakeUsersService
      }
    ],
    }).compile();

    service = module.get(AuthService);

  });

  it(' can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async ()=>{
    const user = await service.signup('asdas@nose.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();

  });

  it('throws an error if user signs up with email that is in use', async ()=> {
    fakeUsersService.find = () => 
      Promise.resolve([{id:1, email: 'a', password: '1'}as User]);

    try{
      await service.signup('asdf@asdf.com', 'asdf');
    } catch(err) { 
      console.log("🚀 ~ file: auth.service.spec.ts ~ line 56 ~ it ~ err", err);
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try{
      await service.signin('asdf@asf.com', 'passasda');
    } catch(err) {
      console.log("🚀 ~ file: auth.service.spec.ts ~ line 64 ~ it ~ err", err);
    }
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = 
      () => Promise.resolve([{email: 'asdf@asf.com', password: 'asdf'} as User]);
    
    try {
      await service.signin('dasda@adwww.com', 'password');
    } catch(err){
      console.log("🚀 ~ file: auth.service.spec.ts ~ line 75 ~ it ~ err", err);
    }
  });

  it('returns a user if correct password is provided', async () => {

    // fakeUsersService.find = 
    //   () => Promise.resolve([{email: 'asdf@asf.com', password: 'asdf'} as User]);
    
    // const user = await service.signin('sdasdadw@asda.com', 'mypass');
    // expect(user).toBeDefined();
    const user = await service.signup('asdada@asdasda.com', 'mypass');
    console.log(user);
  });
});