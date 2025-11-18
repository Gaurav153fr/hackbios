declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        fullName?: string | null;
        workEmail?: string | null;
        image?: string | null;
      };
    }
    declare module "next-auth/jwt" {
        interface JWT {
          id: string;
          fullName?: string | null;
          workEmail?: string | null;
        }
      }
  }  