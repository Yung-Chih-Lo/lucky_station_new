/* Usage: npm run hash-password -- '<your-password>'
   Prints an argon2id hash suitable for ADMIN_PASSWORD_HASH. */
import { hash } from '@node-rs/argon2'

async function main() {
  const pw = process.argv[2]
  if (!pw) {
    console.error('Usage: npm run hash-password -- <password>')
    process.exit(1)
  }
  const h = await hash(pw)
  // 直接貼進 .env.local 的格式：$ 需要用 \$ 跳脫，否則 Next.js env loader 會展開
  console.log(`ADMIN_PASSWORD_HASH=${h.replace(/\$/g, '\\$')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
