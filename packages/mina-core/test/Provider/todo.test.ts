import { test } from 'vitest' // eslint-disable-line import/no-extraneous-dependencies

test('concatenation', () => {
  const str1 = 'Hello'
  const str2 = 'World'
  expect(str1 + ' ' + str2).toBe('Hello World')
})
