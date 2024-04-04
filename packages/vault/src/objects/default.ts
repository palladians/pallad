export const EXAMPLE_CREDENTIAL_NAME = 'Example Pallad Credential'
export const EXAMPLE_CREDENTIAL = {
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

export const DEFAULT_OBJECTS = {
  [EXAMPLE_CREDENTIAL_NAME]: {
    objectName: EXAMPLE_CREDENTIAL_NAME,
    object: EXAMPLE_CREDENTIAL
  }
}
