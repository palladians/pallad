import { credentialName } from '@palladxyz/vault'
import {
  adjectives,
  animals,
  colors,
  Config,
  uniqueNamesGenerator
} from 'unique-names-generator'

const fullConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
  length: 3
}

const shortConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function formatName(name: string): string {
  return name.split(' ').map(capitalizeFirstLetter).join(' ')
}

export function getRandomAnimalName(): credentialName {
  return formatName(uniqueNamesGenerator(fullConfig)) as credentialName
}

export function getShortName(): credentialName {
  return formatName(uniqueNamesGenerator(shortConfig)) as credentialName
}
