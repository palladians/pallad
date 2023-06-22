import React, { useState } from "react";
import { GlobalProvider } from '@ladle/react'
import { Box } from "@palladxyz/ui";
import { theme, ThemeProvider, trpc } from '../src'
import { NativeRouter } from "react-router-native";

export const Provider: GlobalProvider = ({ children }) => {
  const [client] = useState(() => trpc.createClient())
  return <trpc.Provider client={client}><ThemeProvider theme={theme}><NativeRouter><Box css={{ width: 400, height: 600 }}>{children}</Box></NativeRouter></ThemeProvider></trpc.Provider>
}
