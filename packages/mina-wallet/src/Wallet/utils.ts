import { credentialName } from '@palladxyz/vaultv2'

const animalNames: string[] = [
  'Lion',
  'Tiger',
  'Bear',
  'Elephant',
  'Giraffe',
  'Kangaroo',
  'Penguin',
  'Zebra'
]

export function getRandomAnimalName(): credentialName {
  const randomIndex = Math.floor(Math.random() * animalNames.length)
  return animalNames[randomIndex] || ('Lion' as credentialName)
}
