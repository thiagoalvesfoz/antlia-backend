import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepository,
  USER_NAME_PROVIDER,
} from '@account/domain/users.repository';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import { BusinessRuleException } from 'src/common/exceptions/business-rule.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile, User, Role } from '@account/domain/entity';
import { UserDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

class AccountAlreadyExistsException extends BusinessRuleException {
  constructor(field: string) {
    super(`${field} already exists`);
  }
}

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

    // Validação de senha
    if (password !== password_confirmation) {
      throw new BusinessRuleException(
        'password and password_confirmation does not match',
      );
    }

    // validação de conta
    const userAccount = await this.userRepository.findUserAccount(
      username,
      email,
    );

    if (userAccount) {
      throw new AccountAlreadyExistsException(
        userAccount.username === username ? 'username' : 'email',
      );
    }

    // Atribuição de roles
    const assigned_roles = await this.assignRoles(roles);

    // Criação do usuário
    const newUser = new User({
      username,
      password,
      roles: assigned_roles,
      enable: true,
      profile: new Profile({ name, email, cell_phone }),
    });

    newUser.encrypt_password();

    const createdUser = await this.userRepository.create(newUser);

    // Mapeamento para DTO
    return UserDto.build(createdUser);
  }

  async update(user_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserOrFail(user_id);

    const { username, roles, name, email, cell_phone } = updateUserDto;

    // validação de conta
    const userAccount = await this.userRepository.findUserAccount(
      username,
      email,
    );

    if (userAccount.id !== user.id) {
      throw new AccountAlreadyExistsException(
        userAccount.username === username ? 'username' : 'email',
      );
    }

    // Atribuição de roles
    const assigned_roles = await this.assignRoles(roles);

    // Atualização do usuário
    const userToUpdate = new User({
      id: user.id,
      username,
      password: user.password,
      roles: assigned_roles,
      enable: user.enable,
      profile: new Profile({ name, email, cell_phone }),
    });

    const userUpdated = await this.userRepository.update(userToUpdate);

    // Mapeamento para DTO
    return UserDto.build(userUpdated);
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    return users.map(UserDto.build);
  }

  async findOne(user_id: string): Promise<UserDto> {
    const user = await this.findUserOrFail(user_id);
    return UserDto.build(user);
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findByUsername(username);
  }

  async updatePassword(user_id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findUserOrFail(user_id);

    const { password, password_confirmation } = updatePasswordDto;

    if (password !== password_confirmation) {
      throw new BusinessRuleException(
        'password and password_confirmation does not match',
      );
    }

    user.updatePassword(password);

    await this.userRepository.updatePassword(user);
  }

  async toggleEnableUser(user_id: string) {
    const user = await this.findUserOrFail(user_id);
    await this.userRepository.updateEnable(user_id, !user.enable);
  }

  private async findUserOrFail(user_id: string) {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundException('user not found');
    }
    return user;
  }

  private async assignRoles(roles: Role[]) {
    if (roles.length === 0) {
      throw new BusinessRuleException(
        `requires at least one role before registering a new user`,
      );
    }

    const assignedRoles: Role[] = [];

    for (const roleName of roles) {
      const role = await this.userRepository.findRoleByName(roleName);

      if (!role) {
        throw new BusinessRuleException(`role '${roleName}' does not exist`);
      }

      assignedRoles.push(role);
    }

    return assignedRoles;
  }
}
