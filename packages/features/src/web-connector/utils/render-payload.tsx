import { recoverOriginalPayload } from "../components/credential-selection-form"

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
  condition: LogicNode
  thenNode: LogicNode
  elseNode: LogicNode
}

// Extract fields from credential shape
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

const formatLogicNode = (node: LogicNode, indent = ""): string => {
  const nextIndent = `${indent}  `

  switch (node.type) {
    case "and":
      if (!node.inputs?.length) return "AND()"
      return `AND(\n${nextIndent}${node.inputs.map((n) => formatLogicNode(n, nextIndent)).join(`,\n${nextIndent}`)}\n${indent})`
    case "or":
      if (!node.left || !node.right) return "OR()"
      return `OR(\n${nextIndent}${formatLogicNode(node.left, nextIndent)},\n${nextIndent}${formatLogicNode(node.right, nextIndent)}\n${indent})`
    case "equals":
      return `EQUALS(${node.left && node.right ? [formatLogicNode(node.left, nextIndent), formatLogicNode(node.right, nextIndent)].join(", ") : ""})`
    case "equalsOneOf": {
      const input = node.input ? formatLogicNode(node.input, nextIndent) : ""
      const options = Array.isArray(node.options)
        ? `[\n${nextIndent}${node.options.map((o) => formatLogicNode(o, nextIndent)).join(`,\n${nextIndent}`)}\n${indent}]`
        : node.options
          ? formatLogicNode(node.options, nextIndent)
          : ""
      return `EQUALS_ONE_OF(${input}, ${options})`
    }
    case "lessThan":
      return node.left && node.right
        ? `(${formatLogicNode(node.left)} < ${formatLogicNode(node.right)})`
        : ""
    case "lessThanEq":
      return node.left && node.right
        ? `(${formatLogicNode(node.left)} ≤ ${formatLogicNode(node.right)})`
        : ""
    case "add":
      return node.left && node.right
        ? `(${formatLogicNode(node.left)} + ${formatLogicNode(node.right)})`
        : ""
    case "sub":
      return node.left && node.right
        ? `(${formatLogicNode(node.left)} - ${formatLogicNode(node.right)})`
        : ""
    case "mul":
      return node.left && node.right
        ? `(${formatLogicNode(node.left)} × ${formatLogicNode(node.right)})`
        : ""
    case "div":
      return node.left && node.right
        ? `(${formatLogicNode(node.left)} ÷ ${formatLogicNode(node.right)})`
        : ""
    case "constant":
      return node.data ? JSON.stringify(node.data.value || node.data) : ""
    case "ifThenElse":
      if (!node.condition || !node.thenNode || !node.elseNode) return ""
      return [
        "IF",
        formatLogicNode(node.condition, nextIndent),
        "THEN",
        formatLogicNode(node.thenNode, nextIndent),
        "ELSE",
        formatLogicNode(node.elseNode, nextIndent),
      ].join(`\n${nextIndent}`)
    case "property": {
      // Check if this is accessing a specific property of a credential
      if (
        node.inner?.type === "property" &&
        node.inner.key === "data" &&
        node.inner.inner?.type === "property" &&
        node.inner.inner.key
      ) {
        return `${node.inner.inner.key}.${node.key}`
      }
      // Check if this is accessing the full credential
      if (
        node.key === "data" &&
        node.inner?.type === "property" &&
        node.inner.key === "credential" &&
        node.inner.inner?.type === "root"
      ) {
        return "credential"
      }
      if (node.inner?.type === "root") {
        return node.key || ""
      }
      return `${node.key}${node.inner ? `.${formatLogicNode(node.inner)}` : ""}`
    }
    case "root":
      return ""
    case "hash":
      return `HASH(${node.inputs?.map((n) => formatLogicNode(n, nextIndent)).join(", ") || ""})`
    case "issuer":
      return `ISSUER(${node.credentialKey || ""})`
    case "not":
      return `NOT(${node.inner ? formatLogicNode(node.inner, nextIndent) : ""})`
    case "record": {
      if (!node.data || Object.keys(node.data).length === 0) return "RECORD()"
      return `{\n${nextIndent}${Object.entries(node.data)
        .map(([key, value]) => `${key}: ${formatLogicNode(value, nextIndent)}`)
        .join(`,\n${nextIndent}`)}\n${indent}}`
    }
    default:
      return JSON.stringify(node)
  }
}

const formatInputs = (inputs: Record<string, any>): Record<string, any> => {
  const grouped: Record<string, any> = {
    credentials: {},
    claims: {},
    constants: {},
  }

  for (const [key, input] of Object.entries(inputs)) {
    switch (input.type) {
      case "credential":
        grouped.credentials[key] = {
          type: input.credentialType,
          fields: extractCredentialFields(input.data),
        }
        break
      case "claim":
        grouped.claims[key] = input.data._type
        break
      case "constant":
        grouped.constants[key] = {
          type: input.data._type,
          value: input.value,
        }
        break
    }
  }

  return grouped
}

const formatClaimValues = (
  claims: Record<string, any>,
): Record<string, any> => {
  const formatted: Record<string, any> = {}

  for (const [key, claim] of Object.entries(claims)) {
    if (claim._type === "DynamicArray" && claim.value) {
      formatted[key] = claim.value.map((v: any) => v.value)
    } else {
      formatted[key] = claim.value
    }
  }

  return formatted
}

const isPresentationRequest = (
  value: unknown,
): value is { presentationRequest: any } => {
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
    if (isPresentationRequest(parsedPayload)) {
      const request = parsedPayload.presentationRequest
      const formatted = {
        type: request.type,
        inputs: formatInputs(request.spec.inputs),
        logic: {
          assert: formatLogicNode(request.spec.logic.assert),
          outputClaim: formatLogicNode(request.spec.logic.outputClaim),
        },
        claims: formatClaimValues(request.claims),
        context: request.inputContext
          ? {
              type: request.inputContext.type,
              action: request.inputContext.action,
              serverNonce: request.inputContext.serverNonce.value,
            }
          : null,
      }

      let jsonString = JSON.stringify(formatted, null, 2)
      jsonString = jsonString.replace(/\\n/g, "\n")

      return (
        <div>
          <pre className="whitespace-pre-wrap break-all">{jsonString}</pre>
        </div>
      )
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
    return (
      <pre className="whitespace-pre-wrap break-all">{`Error: ${error}`}</pre>
    )
  }
}
