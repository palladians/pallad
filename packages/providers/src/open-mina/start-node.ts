import { exec } from "node:child_process"

function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return reject(error)
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`)
        return reject(new Error(stderr))
      }
      resolve()
    })
  })
}

async function startLocalNode() {
  try {
    await runCommand("apt install curl git")
    await runCommand(
      "curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly-2023-10-07",
    )
    await runCommand('source "$HOME/.cargo/env"')
    await runCommand("git clone https://github.com/openmina/openmina.git")
    await runCommand("cd openmina/ && cargo run --release -p cli node")
  } catch (error) {
    console.error("Failed to start the Rust server:", error)
  }
}

export { startLocalNode }
