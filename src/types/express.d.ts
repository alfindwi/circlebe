// src/types/express.d.ts

import { User } from '@prisma/client'; // Atau sesuai dengan model user yang kamu punya

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

