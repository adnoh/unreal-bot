const dotenv = require('dotenv')
dotenv.config()
dotenv.load({ path: './.env-test' })

test('testing dontenv', () => {
  expect(process.env.UNREAL_BOT_TOKEN).toBe(
    'MzE3Mjc1NDk2MjA1Mzg1NzI5.DAhdig.lfKtEocyy_rYY4FhR0aFy8S_UZo'
  )
})
