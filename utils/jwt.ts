import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const jwt_util = {
  create: (id: string): Promise<string> | string => {
    const token = jwt.sign(id, process.env.JWT_KEY);
    return token;
  },

  verify: async (token: string): Promise<string | any> => {
    try {
      return jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      throw error;
    }
  },
};
