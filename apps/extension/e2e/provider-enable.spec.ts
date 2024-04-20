import { expect, test } from './extension'
import { OnboardingPom } from './pom/onboarding'

const VALIDATOR = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

// Note: These tests are manual
test('enable window.mina and handle pop-up on a specific webpage', async ({
  page,
  extensionId
}) => {
  // Restore the wallet or perform any setup required by your extension before interacting with the webpage.
  const onboardingPom = new OnboardingPom({ page, extensionId })
  await onboardingPom.restoreTestWallet()

  // Navigate to the webpage where the injected script should be interacted with.
  await page.goto('https://google.com')

  // Verify that window.mina is available
  const minaExists = await page.evaluate(() => window.mina !== undefined)
  expect(minaExists).toBe(true)

  // Trigger window.mina.enable() which should open the pop-up
  const enableResponse = await page.evaluate(() => window.mina.enable())
  /**
     Click "Yes" manually
     */
  expect(enableResponse.result.length).toBe(1)
  expect(enableResponse.result[0]).toBe(VALIDATOR)

  const account = await page.evaluate(() =>
    window.mina.request({ method: 'mina_accounts' })
  )
  expect(account.result.length).toBe(1)
  expect(account.result[0]).toBe(VALIDATOR)

  const responseChainId = await page.evaluate(() =>
    window.mina.request({ method: 'mina_chainId' })
  )
  expect(responseChainId.result).not.toBe('...')

  const responseBalance = await page.evaluate(() =>
    window.mina.request({ method: 'mina_getBalance' })
  )
  expect(responseBalance.result).not.toBe(undefined)

  const responseRequestNetwork = await page.evaluate(() =>
    window.mina.request({ method: 'mina_requestNetwork' })
  )
  console.log('responseRequestNetwork:', responseRequestNetwork)
  expect(responseRequestNetwork.result.chainId).not.toBe(undefined)

  const responseAddChain = await page.evaluate(() =>
    window.mina.request({
      method: 'mina_addChain',
      params: {
        nodeEndpoint: {
          providerName: 'mina-node',
          url: 'https://sequencer-zeko-dev.dcspark.io/graphql'
        },
        archiveNodeEndpoint: {
          providerName: 'mina-node',
          url: ''
        },
        networkName: 'ZekoDevNet',
        networkType: 'testnet',
        chainId: '69420'
      }
    })
  )
  console.log('responseAddChain:', responseAddChain)
  expect(responseAddChain.result.networkName).toBe('ZekoDevNet')

  const responseSwitchChain = await page.evaluate(() =>
    window.mina.request({
      method: 'mina_switchChain',
      params: {
        chainId: '69420'
      }
    })
  )
  console.log('responseSwitchChain:', responseSwitchChain)
  expect(responseSwitchChain.result.networkName).toBe('ZekoDevNet')

  const responseBalanceZeko = await page.evaluate(() =>
    window.mina.request({ method: 'mina_getBalance' })
  )
  console.log('responseBalanceZeko:', responseBalanceZeko)
  expect(responseBalanceZeko.result).not.toBe(0)

  await page.evaluate(() =>
    window.mina.request({
      method: 'mina_setState',
      params: {
        objectName: 'New Example Credential',
        object: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'http://example.edu/credentials/3732',
          type: ['VerifiableCredential', 'UniversityDegreeCredential'],
          issuer: 'University of Example',
          issuanceDate: '2010-01-01T00:00:00Z',
          credentialSubject: {
            id: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
            degree: {
              type: 'BachelorDegree',
              name: 'Bachelor of Science and Arts'
            }
          },
          proof: {
            type: 'Kimchi',
            created: '2023-09-19T12:40:16Z',
            proof: {
              publicInput: ['0'],
              publicOutput: ['1'],
              maxProofsVerified: 0,
              proof: 'KChzdGF0ZW1...SkpKSkp'
            }
          }
        }
      }
    })
  )
  /**
     Enter password manually
     */

  const responseGetState = await page.evaluate(() =>
    window.mina.request({
      method: 'mina_getState',
      params: { query: { issuer: 'University of Example' }, props: [] }
    })
  )
  /**
     Enter password manually
     */

  expect(responseGetState.result.length).toBe(2)
})
