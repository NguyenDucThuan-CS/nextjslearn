/* eslint-disable @typescript-eslint/no-unused-vars */
import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers"
import { HttpError } from "@/lib/http";


export async function POST(request: Request) {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken');
    if(!sessionToken) {
      return Response.json({ 
          message: "Không tìm thấy session token"
       }, {
        status: 401,
      })
    }

    try {
      const res = await authApiRequest.logoutFromNextServerToServer(sessionToken.value)
      console.log('resZZZZ', res)
      return Response.json(res.payload , {
        status: 200,
        headers: {
          'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0`
        }
      })
    } catch (error) {
        if(error instanceof HttpError) {
          return Response.json(error.payload, {
            status: error.status
          })
        }
        else {
          return Response.json({
            message: "Lỗi không xác định"
          }, {
            status: 500
          })
        }
      
    }
    
  }