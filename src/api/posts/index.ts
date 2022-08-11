import type { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/jwt';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const prisma = new PrismaClient();
        const allPosts = await prisma.post.findMany({
          include: { author: true }
        });
  
        res.status(200).json(allPosts)
        // 处理完请求以后记得断开数据库链接 
        await prisma.$disconnect()
      } catch (error) {
        return res.status(500).json(error)
      }
      break;
    case 'POST':
      try {
        if (!req.cookies?.token) {
          return res.status(401).json({
            message: 'Unauthorized'
          })
        }
        const prisma = new PrismaClient();
        const authorId = (await verifyToken(req.cookies.token)).id;
        const newPost = await prisma.post.create({
          data: { 
            title: req.body.title,
            content: req.body.content,
            author: req.body.userName,
            authorId,
            imageUrl: req.body.imageUrl,
            createdAt: new Date(),
            tags: req.body.tags.join(","),
           }
        });
  
        res.status(200).json(newPost)
        // 处理完请求以后记得断开数据库链接 
        await prisma.$disconnect()
      } catch (error) {
        return res.status(500).json(error)
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
