type MenuBarProps = {
  leftSlot?: React.ReactNode
  children?: React.ReactNode
  rightSlot?: React.ReactNode
}

export const MenuBar = ({ leftSlot, children, rightSlot }: MenuBarProps) => {
  return (
    <nav className="flex justify-between px-8 py-7">
      <div>{leftSlot}</div>
      <div>{children}</div>
      <div>{rightSlot}</div>
    </nav>
  )
}
