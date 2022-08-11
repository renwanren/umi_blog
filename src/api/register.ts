import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
// import { signToken } from "@/utils/jwt"; // 之后看下怎么配置
import { signToken } from "../../utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        // 建立一个 Prisma 客户端，他可以帮助我们连线到数据库
        const prisma = new PrismaClient();
        // 在数据库的 User 表中建立一个新的数据
        const user = await prisma.user.create({
          data: {
            email: req.body.email,
 
            // 密码是经过 bcrypt 加密的
            passwordHash: bcrypt.hashSync(req.body.password, 8),
            name: req.body.name,
            avatarUrl: req.body.avatarUrl
          }
        });
        // 把建立成功的用户数据（不包含密码）和 JWT 回传给前端
        res.status(201)
          .setCookie('token', await signToken(user.id))
          .json({ ...user, passwordHash: undefined })
 
        // 处理完请求以后记得断开数据库链接 
        await prisma.$disconnect();
      } catch (error) {
        
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
