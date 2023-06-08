import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://graphql.minaexplorer.com/',
  documents: './src/gql/**.gql',
  generates: {
    'src/gql/minaexplorer.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
        { add: { content: "import type {} from 'graphql'" } }
      ]
    }
  }
}

export default config
