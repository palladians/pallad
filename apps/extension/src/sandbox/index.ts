import { Add } from "@palladco/contracts"
import { match } from "ts-pattern"
import { z } from "zod"

const EventTypeSchema = z.enum(["run"])
const ContractTypeSchema = z.enum(["add"])

window.addEventListener("message", async (event) => {
  // Can also read: payload, form
  console.log(event.data)
  console.log(event.data.userInput)
  const type = EventTypeSchema.parse(event.data.type)
  const contract = ContractTypeSchema.parse(event.data.contract)
  return match(type)
    .with("run", async () => {
      return match(contract).with("add", async () => {
        await Add.compile()
        window.parent.postMessage(
          { type: "compiled", result: "test", userInput: event.data.userInput },
          "*",
        )
      })
    })
    .exhaustive()
})
