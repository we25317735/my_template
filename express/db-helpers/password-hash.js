import bcrypt from 'bcrypt'

const saltRounds = 10

// 密碼加密
export const generateHash = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, saltRounds)
}

// 加密後的密碼比對
export const compareHash = async (plainPassword, hash) => {
  return await bcrypt.compare(plainPassword, hash)
}
