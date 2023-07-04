import { cssObj } from '@fuel-ui/css';

export const scrollable = (
  regularColor: string = '$gray1',
  hoverColor: string = '$gray10'
) =>
  cssObj({
    overflowY: 'overlay',
    overflowX: 'hidden',
    scrollBehavior: 'smooth',

    '&::-webkit-scrollbar': {
      width: '14px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: regularColor,
      opacity: 0.5,
      border: '4px solid transparent',
      borderRadius: '12px',
      backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: hoverColor,
    },
  });

export const buttonListItem = cssObj({
  justifyContent: 'normal',
  borderRadius: '$md',
  fontWeight: '$medium',
  fontSize: '$sm',
  px: '$3',
});

const card = cssObj({
  border: '1px solid $border',
  overflowX: 'hidden',
});

export const coreStyles = {
  scrollable,
  buttonListItem,
  card,
};
