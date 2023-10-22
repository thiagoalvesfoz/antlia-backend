import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/users.repository';
import { BusinessRuleException } from 'src/@shared/business-rule.exception';

import { Role } from '../entity/role.entity';
import { UserDto } from '../dto/user-response.dto';
import { ResourceNotFoundException } from 'src/@shared/resource-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { username, password, password_confirmation, roles } = createUserDto;

    if (password !== password_confirmation) {
      throw new BusinessRuleException(
        'password and password_confirmation does not match',
      );
    }

    const userAlreadyExists = await this.userRepository.findByUsername(
      username,
    );

    if (!!userAlreadyExists) {
      throw new BusinessRuleException('username already exists');
    }

    const assigned_roles = await this.asignRoles(roles);

    const register = new User({
      username,
      password,
      roles: assigned_roles,
    });

    register.encrypt_password();

    const user = await this.userRepository.create(register);

    return UserDto.build(user);
  }

  async asignRoles(roles: Role[]) {
    if (roles.length === 0) {
      throw new BusinessRuleException(
        `requires at least one role before registering a new user`,
      );
    }

    const rolesToAdd: Role[] = [];

    for (const index in roles) {
      const roleDB = await this.userRepository.findRoleByName(roles[index]);

      if (!roleDB) {
        throw new BusinessRuleException(`role '${roles[index]}' is not exists`);
      }

      rolesToAdd.push(roleDB);
    }

    return rolesToAdd;
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    return users.map(UserDto.build);
  }

  async findOne(user_id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundException('user not found');
    }

    return UserDto.build(user);
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findByUsername(username);
  }
}
