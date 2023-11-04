import { hashSync } from "bcrypt";
import { PrismaClient } from '@prisma/client'

async function main() {
    const prismaClient = new PrismaClient();

    if (!(await prismaClient.role.count())) {
        await prismaClient.role.createMany({
            skipDuplicates: true,
            data: [
                { name: 'ADMIN' },
                { name: 'USER' }
            ],
        })
    }

    if (await prismaClient.user.count()) {
        return
    }

    
    const user = {
        username: 'admin',
        password: hashSync('123123', 10),
        roles: ['ADMIN'],
        profile: {
            name: 'Administrator',
            email: 'admin@antlia.com.br',
            cell_phone: '99999999',
        }
    }

    await prismaClient.user.create({
        data: {
            username: user.username,
            password: user.password,
            roles: {
              create: user.roles.map((role) => ({
                assigned_by: user.profile.name,
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
    })
}

main();
