import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserRepository } from '../domain/repository/users.repository';
import { Profile as ProfileModel, User as UserModel } from '@prisma/client';
import { Role } from '../domain/entity/role.entity';
import { User } from '../domain/entity/user.entity';

type RolesProps = {
  role: {
    id: string;
    name: string;
  };
};

type UserModelMapper = UserModel & {
  roles?: RolesProps[];
  profile: ProfileModel;
};

const include_roles_and_profile = {
  roles: {
    select: {
      role: true,
    },
  },
  profile: {
    select: {
      id: true,
      name: true,
      email: true,
      cell_phone: true,
      user_id: true,
      created_at: true,
      updated_at: true,
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
        profile: {
          create: {
            name: user.profile.name,
            email: user.profile.email,
            cell_phone: user.profile.cell_phone,
          },
        },
      },
      include: include_roles_and_profile,
    });

    return this.#map(userModel);
  }

  async findAll(): Promise<User[]> {
    const users: UserModel[] = await this.prismaService.user.findMany({
      include: include_roles_and_profile,
    });

    return users.map(this.#map);
  }

  async findById(id: string): Promise<User> {
    if (!id) return;

    const userModel = await this.prismaService.user.findFirst({
      where: { id },
      include: include_roles_and_profile,
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
      include: include_roles_and_profile,
    });

    return this.#map(userModel);
  }

  #map(userModel: UserModelMapper): User {
    const roles = userModel?.roles?.map((userRole) => Role[userRole.role.name]);

    let profile = null;

    if (userModel?.profile) {
      profile = {
        id: userModel?.profile?.id,
        name: userModel?.profile?.name,
        email: userModel?.profile?.email,
        cell_phone: userModel?.profile?.cell_phone,
        user_id: userModel?.profile?.user_id,
        created_at: userModel?.profile?.created_at,
        updated_at: userModel?.profile?.updated_at,
      };
    }

    return userModel
      ? new User({
          id: userModel.id,
          username: userModel.username,
          password: userModel.password,
          roles: roles,
          profile,
          created_at: userModel.created_at,
          updated_at: userModel.updated_at,
        })
      : undefined;
  }
}
