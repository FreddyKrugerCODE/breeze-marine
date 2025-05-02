import { sql, generateId } from "../db"
import * as bcrypt from "bcryptjs"

export type User = {
  id: string
  email: string
  name: string
  role: string
  passwordHash: string
  createdAt?: Date
  updatedAt?: Date
}

export type UserWithoutPassword = Omit<User, "passwordHash">

export async function getUsers(): Promise<UserWithoutPassword[]> {
  const users = await sql<User[]>(`SELECT * FROM "User" ORDER BY name ASC`)
  return users.map(({ passwordHash, ...user }) => user)
}

export async function getUserById(id: string): Promise<UserWithoutPassword | null> {
  const users = await sql<User[]>('SELECT * FROM "User" WHERE id = $1', [id])
  if (users.length === 0) return null

  const { passwordHash, ...user } = users[0]
  return user
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await sql<User[]>('SELECT * FROM "User" WHERE email = $1', [email])
  return users.length > 0 ? users[0] : null
}

export async function createUser(
  user: Omit<User, "id" | "passwordHash" | "createdAt" | "updatedAt"> & { password: string },
): Promise<UserWithoutPassword> {
  const id = generateId()
  const now = new Date()
  const passwordHash = await bcrypt.hash(user.password, 10)

  const result = await sql<User[]>(
    `
    INSERT INTO "User" (
      id, email, name, role, "passwordHash", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    ) RETURNING *
  `,
    [id, user.email, user.name, user.role || "staff", passwordHash, now, now],
  )

  const { passwordHash: _, ...createdUser } = result[0]
  return createdUser
}

export async function updateUser(
  id: string,
  user: Partial<Omit<User, "passwordHash"> & { password?: string }>,
): Promise<UserWithoutPassword | null> {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  // Handle password separately
  if (user.password) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    updates.push(`"passwordHash" = $${paramIndex}`)
    values.push(passwordHash)
    paramIndex++
    delete user.password
  }

  Object.entries(user).forEach(([key, value]) => {
    if (key !== "id" && key !== "createdAt" && key !== "passwordHash") {
      updates.push(`"${key}" = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  })

  updates.push(`"updatedAt" = $${paramIndex}`)
  values.push(new Date())
  paramIndex++

  values.push(id)

  const query = `
    UPDATE "User" 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const result = await sql<User[]>(query, values)
  if (result.length === 0) return null

  const { passwordHash, ...updatedUser } = result[0]
  return updatedUser
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await sql<{ count: number }[]>(
    `
    DELETE FROM "User" WHERE id = $1
    RETURNING COUNT(*) as count
  `,
    [id],
  )

  return result[0].count > 0
}

export async function verifyCredentials(email: string, password: string): Promise<UserWithoutPassword | null> {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) return null

  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
}
