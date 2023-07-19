import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('Executou Setup')

    return {
      async teardown() {
        console.log('Executou Teardown')
      },
    }
  },
}
