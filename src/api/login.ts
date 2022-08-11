import type { UmiApiRequest, UmiApiResponse } from "umi";
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../../utils/jwt';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
          where: { email: req.body.email }
        });
        const {password} = req.body;
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
          return res.status(401).json({ // 401是什么错误？
            message: 'Invalid email or password',
          })
        }
  
        res.status(200)
          .setCookie('token', await signToken(user.id))
          .json({ ...user, passwordHash: undefined })
        // 处理完请求以后记得断开数据库链接 
        await prisma.$disconnect(); 
      } catch (error) {
        return res.status(500).json(error)
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
