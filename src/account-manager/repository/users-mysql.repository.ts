import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserRepository } from './users.repository';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../entity/role.entity';

type RolesProps = {
  role: {
    id: string;
    name: string;
  };
};

type UserModelMapper = UserModel & {
  roles?: RolesProps[];
};

const include_roles = {
  roles: {
    select: {
      role: true,
    },
  },
};

@Injectable()
export class UserMysqlRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User): Promise<User> {
    const { username, password, roles } = user;

    const userModel = await this.prismaService.user.create({
      data: {
        username,
        password,
        roles: {
          create: roles.map((role) => ({
            assigned_by: 'admin',
            role: {
              connect: {
                name: role,
              },
            },
          })),
        },
      },
      include: include_roles,
    });

    return this.#map(userModel);
  }

  async findAll(): Promise<User[]> {
    const users: UserModel[] = await this.prismaService.user.findMany({
      include: include_roles,
    });

    return users.map(this.#map);
  }

  async findById(id: string): Promise<User> {
    if (!id) return;

    const userModel = await this.prismaService.user.findFirst({
      where: { id },
      include: include_roles,
    });

    return this.#map(userModel);
  }

  async findRoleByName(roleName: Role): Promise<Role> {
    if (!roleName) return;

    const role = await this.prismaService.role.findFirst({
      where: { name: roleName },
    });

    return role ? Role[role.name] : undefined;
  }

  async findByUsername(username: any): Promise<User> {
    if (!username) return;

    const userModel = await this.prismaService.user.findFirst({
      where: { username },
      include: include_roles,
    });

    return this.#map(userModel);
  }

  #map(userModel: UserModelMapper): User {
    const roles = userModel?.roles?.map((userRole) => Role[userRole.role.name]);

    return userModel
      ? new User({
          id: userModel.id,
          username: userModel.username,
          password: userModel.password,
          roles: roles,
          created_at: userModel.created_at,
          updated_at: userModel.updated_at,
        })
      : undefined;
  }
}