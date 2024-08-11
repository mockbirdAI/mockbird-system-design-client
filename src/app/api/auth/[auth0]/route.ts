// app/api/auth/[auth0]/route.js
import { GetLoginState, handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

// export const GET = handleAuth();

const afterCallback = async (req: NextApiRequest, session: any, state: any) => {
  console.log('I am getting called after callback', session)
  if (session.user) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.given_name + ' ' + session.user.family_name,
            profilePicture: session.user.picture
          }
        });
      }
      console.log('user found', session.user)
    } catch (error) {
      console.error("error with prisma", error)
    }
  } else {
      console.log('user not found', session)
  }
  return session;
};

export const GET = handleAuth({
  callback: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handleCallback(req, res, {
          afterCallback
      });
    } catch (error) {
        console.error(error);
    }
  }
})