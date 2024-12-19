import { beforeAll, describe, expect, it } from "bun:test"
import { AccountUpdate, Field, Mina, PrivateKey } from "o1js"
import { Add } from "./add"

describe("Add", () => {
  beforeAll(async () => {
    await Add.compile()
  })

  it("works lol", async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled: true })
    Mina.setActiveInstance(Local)
    const [deployerAccount] = Local.testAccounts
    const zkAppPrivateKey = PrivateKey.random()
    const zkAppAddress = zkAppPrivateKey.toPublicKey()
    const zkApp = new Add(zkAppAddress)
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount)
      await zkApp.deploy()
    })
    await txn.prove()
    await txn.sign([deployerAccount.key, zkAppPrivateKey]).send()
    const num = zkApp.num.get()
    expect(num).toEqual(Field(1))
  })
})
