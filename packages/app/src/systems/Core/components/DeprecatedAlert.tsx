import { Box, Flex, Icon, Link, Text } from '@fuel-ui/react';

export function DeprecatedAlert() {
  const colors = {
    backgroundColor: '#fffab8',
    color: '#a06e00',
  };

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
            backgroundColor: colors.backgroundColor,
            width: '100%',
            py: '$2',
            color: colors.color,
            border: 'hsla(0,0%,0%,1)',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          <Box css={{ p: '$3' }}>
            <Icon icon="AlertTriangle" />
          </Box>
          <Box>
            <Text fontSize="sm" css={{ color: colors.color }}>
              This app is compatible with beta-4 network and Fuel Wallet version
              0.13.2. For newer versions access: &nbsp;
              <Link
                href="https://app.fuel.network"
                isExternal
                css={{ color: '#00894f' }}
              >
                https://app.fuel.network
              </Link>
              <br />
              This app will be shutdown on March 1st.
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
