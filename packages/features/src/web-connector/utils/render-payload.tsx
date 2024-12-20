import xss from "xss"
import { recoverOriginalPayload } from "../components/credential-selection-form"

const handleRenderError = (error: Error) => {
  const sanitizedError = xss(error.message)

  return (
    <pre className="whitespace-pre-wrap break-all">
      {`Error: ${sanitizedError}`}
    </pre>
  )
}

type LogicNode = {
  type: string
  inputs?: LogicNode[]
  left?: LogicNode
  right?: LogicNode
  key?: string
  inner?: LogicNode
  data?: Record<string, LogicNode>
  credentialKey?: string
  input?: LogicNode
  options?: LogicNode[] | LogicNode
  condition?: LogicNode
  thenNode?: LogicNode
  elseNode?: LogicNode
}

const extractCredentialFields = (data: any): string[] => {
  if (!data) return []

  if (data._type === "Struct" && data.properties) {
    return Object.keys(data.properties)
  }

  if (data._type === "DynamicRecord" && data.knownShape) {
    return Object.keys(data.knownShape)
  }

  return Object.keys(data)
}

const buildPropertyPath = (node: LogicNode): string => {
  const parts: string[] = []
  let currentNode: LogicNode | undefined = node

  while (currentNode?.type === "property") {
    if (!currentNode.key) {
      throw Error("PROPERTY node must have 'key'")
    }
    parts.unshift(currentNode.key)
    currentNode = currentNode.inner
  }

  return parts.join(".")
}

const formatLogicNode = (node: LogicNode, level = 0): string => {
  const indent = "  ".repeat(level)

  switch (node.type) {
    case "and":
      if (!node.inputs) {
        throw Error("AND node must have 'inputs' array")
      }
      if (node.inputs.length === 0) {
        throw Error("AND node must have at least one input")
      }
      return `${indent}All of these conditions must be true:\n${node.inputs
        .map((n) => `${indent}- ${formatLogicNode(n, level + 1)}`)
        .join("\n")}`

    case "or":
      if (!node.left || !node.right) {
        throw Error("OR node must have both 'left' and 'right' nodes")
      }
      return `${indent}Either:\n${indent}- ${formatLogicNode(node.left, level + 1)}\n${indent}Or:\n${indent}- ${formatLogicNode(node.right, level + 1)}`

    case "equals":
      if (!node.left || !node.right) {
        throw Error("EQUALS node must have both 'left' and 'right' nodes")
      }
      return `${formatLogicNode(node.left)} equals ${formatLogicNode(node.right)}`

    case "equalsOneOf": {
      if (!node.input) {
        throw Error("EQUALS_ONE_OF node must have 'input' node")
      }
      if (!node.options) {
        throw Error("EQUALS_ONE_OF node must have 'options'")
      }
      const input = formatLogicNode(node.input, level)
      const options = Array.isArray(node.options)
        ? node.options.map((o) => formatLogicNode(o, level)).join(", ")
        : formatLogicNode(node.options, level)
      return `${options} contains ${input}`
    }

    case "lessThan":
      if (!node.left || !node.right) {
        throw Error("LESS_THAN node must have both 'left' and 'right' nodes")
      }
      return `${formatLogicNode(node.left)} < ${formatLogicNode(node.right)}`

    case "lessThanEq":
      if (!node.left || !node.right) {
        throw Error("LESS_THAN_EQ node must have both 'left' and 'right' nodes")
      }
      return `${formatLogicNode(node.left)} ≤ ${formatLogicNode(node.right)}`

    case "property": {
      if (!node.key) {
        throw Error("PROPERTY node must have 'key'")
      }

      // If this is the root property, just return the path
      if (node.inner?.type === "root") {
        return node.key
      }

      // For nested properties, build the complete path
      return buildPropertyPath(node)
    }

    case "root":
      return ""

    case "hash":
      if (!node.inputs) {
        throw Error("HASH node must have 'inputs' array")
      }
      return `hash(${node.inputs.map((n) => formatLogicNode(n, level)).join(", ")})`

    case "issuer":
      if (!node.credentialKey) {
        throw Error("ISSUER node must have 'credentialKey'")
      }
      return `issuer(${node.credentialKey})`

    case "not":
      if (!node.inner) {
        throw Error("NOT node must have 'inner' node")
      }
      return `not ${formatLogicNode(node.inner, level)}`

    case "add":
      if (!node.left || !node.right) {
        throw Error("ADD node must have both 'left' and 'right' nodes")
      }
      return `${formatLogicNode(node.left)} + ${formatLogicNode(node.right)}`

    case "sub":
      if (!node.left || !node.right) {
        throw Error("SUB node must have both 'left' and 'right' nodes")
      }
      return `${formatLogicNode(node.left)} - ${formatLogicNode(node.right)}`

    case "mul":
      if (!node.left || !node.right) {
        throw Error("MUL node must have both 'left' and 'right' nodes")
      }
      return `${formatLogicNode(node.left)} x ${formatLogicNode(node.right)}`

    case "div":
      if (!node.left || !node.right) {
        throw Error("DIV node must have both 'left' and 'right' nodes")
      }
      return `${formatLogicNode(node.left)} ÷ ${formatLogicNode(node.right)}`

    case "record": {
      if (!node.data) {
        throw Error("RECORD node must have 'data' object")
      }
      if (Object.keys(node.data).length === 0) {
        throw Error("RECORD node must have at least one data field")
      }
      return Object.entries(node.data)
        .map(([key, value]) => `${key}: ${formatLogicNode(value, level)}`)
        .join(`\n${indent}`)
    }
    case "constant":
      if (!node.data) {
        throw Error("CONSTANT node must have 'data'")
      }
      return `${node.data}`
    case "ifThenElse":
      if (!node.condition || !node.thenNode || !node.elseNode) {
        throw Error(
          "IF_THEN_ELSE node must have 'condition', 'thenNode', and 'elseNode'",
        )
      }
      return `${indent}If this condition is true:\n${indent}- ${formatLogicNode(node.condition, level + 1)}\n${indent}Then:\n${indent}- ${formatLogicNode(node.thenNode, level + 1)}\n${indent}Otherwise:\n${indent}- ${formatLogicNode(node.elseNode, level + 1)}`

    default:
      throw Error(`Unknown node type: ${node.type}`)
  }
}

const formatInputsHumanReadable = (inputs: Record<string, any>): string => {
  const sections: string[] = []

  // Handle credentials
  const credentials = Object.entries(inputs).filter(
    ([_, input]) => input.type === "credential",
  )
  if (credentials.length > 0) {
    sections.push("Required credentials:")
    for (const [key, input] of credentials) {
      const fields = extractCredentialFields(input.data)
      const wrappedFields = fields.reduce((acc, field, i) => {
        if (i === fields.length - 1) return acc + field
        return `${acc + field}, `
      }, "")
      sections.push(
        `- ${key} (type: ${input.credentialType}):\n  Contains: ${wrappedFields}`,
      )
    }
  }

  // Handle claims
  const claims = Object.entries(inputs).filter(
    ([_, input]) => input.type === "claim",
  )
  if (claims.length > 0) {
    sections.push("\nClaims:")
    for (const [key, input] of claims) {
      sections.push(`- ${key}: ${input.data._type}`)
    }
  }

  // Handle constants
  const constants = Object.entries(inputs).filter(
    ([_, input]) => input.type === "constant",
  )
  if (constants.length > 0) {
    sections.push("\nConstants:")
    for (const [key, input] of constants) {
      sections.push(`- ${key}: ${input.data._type} = ${input.value}`)
    }
  }

  return sections.join("\n")
}

const formatClaimsHumanReadable = (claims: Record<string, any>): string => {
  const sections = ["\nClaimed values:"]

  for (const [key, claim] of Object.entries(claims)) {
    if (claim._type === "DynamicArray" && claim.value) {
      const values = claim.value.map((v: any) => v.value).join(", ")
      sections.push(`- ${key}:\n  ${values}`)
    } else {
      sections.push(`- ${key}: ${claim.value}`)
    }
  }

  return sections.join("\n")
}

const containsPresentationRequest = (
  value: unknown,
): value is {
  presentationRequest: any
  verifierIdentity:
    | string
    | { address: string; tokenId: string; network: "devnet" | "mainnet" }
} => {
  if (typeof value !== "object" || value === null) return false
  return "presentationRequest" in value
}

const isCredential = (value: unknown): value is Record<string, any> => {
  if (typeof value !== "object" || value === null) return false
  return "credential" in value
}

const simplifyCredentialData = (
  data: Record<string, any>,
): Record<string, string> => {
  const simplified: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      if ("bytes" in value) {
        simplified[key] = value.bytes
          .map((b: { value: string }) => b.value)
          .join("")
      } else if ("value" in value) {
        simplified[key] = value.value
      } else {
        simplified[key] = value
      }
    } else {
      simplified[key] = value
    }
  }
  return simplified
}

export const renderPayload = (payload: string) => {
  try {
    const originalPayload = recoverOriginalPayload(payload)
    const parsedPayload = JSON.parse(originalPayload)

    // Handle presentation request format
    if (containsPresentationRequest(parsedPayload)) {
      const request = parsedPayload.presentationRequest

      // Construct verifierUrl if it's a zk-app request and verifierIdentity is a zkAppAccount
      const verifierUrl =
        request.type === "zk-app" &&
        typeof parsedPayload.verifierIdentity === "object"
          ? `minascan.io/${parsedPayload.verifierIdentity.network}/account/${parsedPayload.verifierIdentity.address}`
          : undefined

      const formatted = [
        `Type: ${request.type}`,
        "",
        formatInputsHumanReadable(request.spec.inputs),
        "",
        `Requirements:\n${formatLogicNode(request.spec.logic.assert, 0)}`,
        "",
        `Output:\n${formatLogicNode(request.spec.logic.outputClaim, 0)}`,
        formatClaimsHumanReadable(request.claims),
        request.inputContext
          ? `\nContext:\n- Type: ${request.inputContext.type}\n- Action: ${typeof request.inputContext.action === "string" ? request.inputContext.action : request.inputContext.action.value}\n- Server Nonce: ${request.inputContext.serverNonce.value}`
          : "",
        "origin" in parsedPayload ? `\nOrigin: ${parsedPayload.origin}` : "",
        parsedPayload.verifierIdentity
          ? `\nVerifier Identity: ${
              request.type === "zk-app"
                ? JSON.stringify(parsedPayload.verifierIdentity, null, 2)
                : parsedPayload.verifierIdentity
            }`
          : "",
        verifierUrl ? `\nSee verifier on Minascan: https://${verifierUrl}` : "",
      ].join("\n")

      return <div className="whitespace-pre-wrap break-all">{formatted}</div>
    }

    // Handle credential format
    if (isCredential(parsedPayload)) {
      const credentialData =
        parsedPayload.credential.value?.data || parsedPayload.credential.data
      const simplifiedData = simplifyCredentialData(credentialData)
      const description = parsedPayload.metadata?.description

      return (
        <div className="space-y-4">
          {description && <p className="text-sm">{description}</p>}
          <pre className="whitespace-pre-wrap break-all bg-neutral-900 p-3 rounded">
            {JSON.stringify(simplifiedData, null, 2)}
          </pre>
        </div>
      )
    }

    // Default fallback
    return <pre className="whitespace-pre-wrap break-all">{payload}</pre>
  } catch (error) {
    if (error instanceof Error) {
      return handleRenderError(error)
    }
    // This case should never occur given the error sources
    return (
      <pre className="whitespace-pre-wrap break-all">
        Error: Unexpected render error
      </pre>
    )
  }
}
