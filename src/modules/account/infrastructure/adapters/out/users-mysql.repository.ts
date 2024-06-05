import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserRepository } from '@account/domain/users.repository';
import { Profile as ProfileModel, User as UserModel } from '@prisma/client';
import { Role, User } from '@account/domain/entity';

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
    const { username, password, enable, roles } = user;

    const userModel = await this.prismaService.user.create({
      data: {
        username,
        password,
        enable,
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

  async update(user: User): Promise<User> {
    if (!user.id) return;
    const { id, username, enable, password } = user;

    const userModel = await this.prismaService.$transaction(async (tx) => {
      // Primeiro, removemos todas as roles antigas do usuário
      await tx.rolesOnUsers.deleteMany({
        where: { user_id: id },
      });

      const userModel = await tx.user.update({
        where: { id },
        data: {
          username,
          password,
          enable,
          profile: {
            upsert: {
              create: {
                name: user.profile.name,
                email: user.profile.email,
                cell_phone: user.profile.cell_phone,
              },
              update: {
                name: user.profile.name,
                email: user.profile.email,
                cell_phone: user.profile.cell_phone,
              },
            },
          },
          roles: {
            create: user.roles.map((role) => ({
              assigned_by: 'admin',
              role: {
                connect: {
                  name: role,
                },
              },
            })),
          },
        },
        include: include_roles_and_profile,
      });

      return userModel;
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

  async isEmailExists(email: string): Promise<boolean> {
    if (!email) return;

    const emailFound = await this.prismaService.profile.count({
      where: { email },
    });

    return emailFound > 0;
  }

  async findUserAccount(username: string, email: string): Promise<User> {
    if (!email) return;

    const userModel = await this.prismaService.user.findFirst({
      where: { OR: [{ username }, { profile: { email } }] },
      include: include_roles_and_profile,
    });

    return this.#map(userModel);
  }

  async updatePassword(user: User): Promise<void> {
    if (!user.id) return;

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: user.password,
      },
    });
  }

  async updateEnable(user_id: string, enable: boolean): Promise<void> {
    if (!user_id) return;

    await this.prismaService.user.update({
      where: { id: user_id },
      data: {
        enable,
      },
    });
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
          enable: userModel.enable,
          created_at: userModel.created_at,
          updated_at: userModel.updated_at,
          roles: roles,
          profile,
        })
      : undefined;
  }
}
