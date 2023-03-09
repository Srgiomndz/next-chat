import nextAuth from 'next-auth'

declare module 'next-auth' {
   
   interface Session {
    user: User
   }
   
    interface User {
      id: string
      username: string
   }
}


// The interfaces we create here are going to be combined with the 'next-auth' library