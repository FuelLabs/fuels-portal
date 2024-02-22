import { Box, Flex, Icon, Link, Text } from '@fuel-ui/react';

export function DeprecatedAlert() {
  return (
    <>
      <Box
        css={{
          margin: '0 auto',
          width: '100%',
          maxWidth: '80rem',
          overflow: 'hidden',
          '@lg': {
            px: '3.5rem',
            width: 'calc(100% - 7rem)',
          },
        }}
      >
        <Flex
          css={{
            backgroundColor: 'hsla(51.25,100%,18.82%,1)',
            width: '100%',
            p: '$2',
            color: 'white',
            border: 'hsla(0,0%,0%,1)',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          <Box css={{ p: '$3' }}>
            <Icon icon="AlertTriangle" />
          </Box>
          <Box>
            <Text fontSize="sm" color="white">
              This app is compatible only with the beta-4 network and Fuel
              Wallet version 0.13.2. For newer versions access: &nbsp;
              <Link
                href="https://app.fuel.network"
                isExternal
                color="$accent11"
              >
                https://app.fuel.network
              </Link>
              This app will be shutdown in on March 1st.
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
