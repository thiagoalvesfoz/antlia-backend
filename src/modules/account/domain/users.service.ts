import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepository,
  USER_NAME_PROVIDER,
} from './repository/users.repository';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import { BusinessRuleException } from 'src/common/exceptions/business-rule.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from './entity/profile.entity';
import { UserDto } from './dto/user-response.dto';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_NAME_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const {
      username,
      password,
      password_confirmation,
      roles,
      name,
      email,
      cell_phone,
    } = createUserDto;

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

    const isEmailExists: boolean = await this.userRepository.isEmailExists(
      email,
    );
    if (!!isEmailExists) {
      throw new BusinessRuleException('email already exists');
    }

    const assigned_roles = await this.asignRoles(roles);

    const register = new User({
      username,
      password,
      roles: assigned_roles,
      profile: new Profile({ name, email, cell_phone }),
    });

    register.encrypt_password();

    const user = await this.userRepository.create(register);

    return UserDto.build(user);
  }

  async update(user_id: string, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundException('user not found');
    }

    const { username, roles, name, email, cell_phone } = updateUserDto;

    if (user.username !== username) {
      const userAlreadyExists = await this.userRepository.findByUsername(
        username,
      );

      if (!!userAlreadyExists) {
        throw new BusinessRuleException('username already exists');
      }
    }

    if (user.profile.email !== email) {
      const isEmailExists: boolean = await this.userRepository.isEmailExists(
        email,
      );
      if (!!isEmailExists) {
        throw new BusinessRuleException('email already exists');
      }
    }

    const assigned_roles = await this.asignRoles(roles);

    const userToUpdate = new User({
      id: user.id,
      username,
      password: user.password,
      roles: assigned_roles,
      profile: new Profile({ name, email, cell_phone }),
    });

    user = await this.userRepository.update(userToUpdate);
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

  async updatePassword(user_id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundException('user not found');
    }

    const { password, password_confirmation } = updatePasswordDto;

    if (password !== password_confirmation) {
      throw new BusinessRuleException(
        'password and password_confirmation does not match',
      );
    }

    user.updatePassword(password);

    await this.userRepository.updatePassword(user);
  }
}
