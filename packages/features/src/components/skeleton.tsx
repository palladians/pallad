type SkeletonProps = {
  loading: boolean
  h: string
  children?: React.ReactNode
}

export const Skeleton = ({ loading, h, children }: SkeletonProps) => {
  if (loading) {
    return <div className="skeleton w-full" style={{ height: h }} />
  }
  return children
}
