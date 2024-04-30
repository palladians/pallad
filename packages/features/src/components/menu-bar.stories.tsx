import type { StoryDefault } from "@ladle/react"
import { MenuBar } from "./menu-bar"

export const Dashboard = () => <MenuBar variant="dashboard" />

export const Wallet = () => <MenuBar variant="wallet" />

export const Card = () => <MenuBar variant="card" />

export const Back = () => <MenuBar variant="back" />

export const BackStop = () => <MenuBar variant="back-stop" />

export const Stop = () => <MenuBar variant="stop" />

export default {
  title: "Components / Menu Bar",
} satisfies StoryDefault
