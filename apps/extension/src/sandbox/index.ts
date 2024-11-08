import { Add } from "@palladco/contracts"
import { match } from "ts-pattern"

window.addEventListener("message", async (event) => {
  return match(event.data.type)
    .with("compile", async () => {
      await Add.compile()
      window.parent.postMessage({ type: "compiled" }, "*")
    })
    .run()
})
