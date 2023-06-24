import validatorsData from '../data/validators.json'

const handler = async () => {
  return new Response(
    JSON.stringify({ data: { validators: validatorsData.validators } })
  )
}

export const config = {
  path: '/getValidators'
}

export default handler
