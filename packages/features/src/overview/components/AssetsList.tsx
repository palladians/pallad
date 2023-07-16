import { useNavigate } from 'react-router-dom'

import { ViewHeading } from '../../common/components/ViewHeading'

export const AssetsList = () => {
  const navigate = useNavigate()
  // const { data: accountQuery, isLoading } = useAccount()
  // const rawMinaBalance = parseFloat(
  //   accountQuery?.result?.data?.account?.balance?.total
  // )
  // const minaBalance = rawMinaBalance ? rawMinaBalance.toFixed(4) : '0'
  return (
    <div className="flex-1 p-4 gap-3">
      <ViewHeading
        title="Assets"
        button={{
          label: 'See Transactions',
          onClick: () => navigate('/transactions')
        }}
      />
      {/*{isLoading ? (*/}
      {/*  <Spinner />*/}
      {/*) : (*/}
      {/*  <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>*/}
      {/*    <Box*/}
      {/*      css={{*/}
      {/*        padding: 12,*/}
      {/*        borderRadius: '50%',*/}
      {/*        backgroundColor: '$gray800',*/}
      {/*        justifyContent: 'center',*/}
      {/*        alignItems: 'center'*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Image source={icons.iconMina} css={{ width: 28, height: 28 }} />*/}
      {/*    </Box>*/}
      {/*    <Text css={{ flex: 1, fontWeight: 500, color: '$gray100' }}>*/}
      {/*      MINA*/}
      {/*    </Text>*/}

      {/*    <Text css={{ width: 'auto', color: '$gray100' }}>{minaBalance}</Text>*/}
      {/*  </Box>*/}
      {/*)}*/}
    </div>
  )
}
