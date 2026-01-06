import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { jwtConfig } from '../config/jwt';

export interface User {
  id: string;
  email: string;
  created_at: Date;
}

export const authService = {
  async signup(email: string, password: string): Promise<{ user: User; token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    return { user, token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const result = await pool.query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    return {
      user: { id: user.id, email: user.email, created_at: user.created_at },
      token,
    };
  },

  async getUser(userId: string): Promise<User> {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  },
};
