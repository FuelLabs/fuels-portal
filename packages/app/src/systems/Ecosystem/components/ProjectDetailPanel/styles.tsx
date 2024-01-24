import { cssObj } from '@fuel-ui/css';

export const styles = {
  panelStyle: cssObj({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    position: 'fixed',
    right: 0,
    top: 0,
    height: '95%',
    width: '650px',
    backgroundColor: '$intentsBase1',
    padding: '30px',
    overflowY: 'auto',
    zIndex: 1000,
    borderLeft: '0.5px solid #2E2E2E',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
    '&[data-mobile="true"]': {
      width: '88%',
      overflowY: 'scroll',
    },
  }),
  closeButton: cssObj({
    display: 'flex',
    position: 'fixed',
    top: 15,
    right: 15,
    backgroundColor: '$intentsBase5',
    borderRadius: '$md',
    border: '1px solid $intentsBase10',
    height: '25px',
    width: '25px',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  }),
  statusAlignment: cssObj({
    display: 'flex',
    flexDirection: 'row',
    //alignItems: 'center',
  }),
  bannerContainer: cssObj({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  imageContainer: cssObj({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85px',
    height: '85px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '20px',
    position: 'absolute',
    border: '1px solid $intentsBase8',
    backgroundColor: '$intentsBase1',
    left: '30px',
    top: '165px',
    zIndex: 2,
  }),
  image: cssObj({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '6.5px',
    transform: 'scale(230%)',
  }),
  websiteButton: cssObj({
    alignItems: 'center',
    //overflow: 'hidden',
    position: 'relative',
    marginBottom: '7.5px',
    border: '1px solid $intentsBase8',
    zIndex: 3,
  }),
  socials: cssObj({
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    marginBottom: '25px',
  }),
  badge: cssObj({
    fontSize: 'small',
    fontWeight: '500',
    position: 'relative',
  }),
  h1: cssObj({
    fontSize: '24px',
    alignItems: 'center',
    marginBottom: '7.5px',
    position: 'relative',
    marginTop: '240px',
  }),
  h2: cssObj({
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
    position: 'relative',
  }),
  tagBox: cssObj({
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    flexWrap: 'wrap',
    position: 'relative',
  }),
  banner: cssObj({
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    minHeight: '210px',
    maxHeight: '225px',
    height: 'fit-content',
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottom: '1px solid #2E2E2E',
  }),
  paragraph: cssObj({
    fontSize: '16px',
    marginBottom: '20px',
  }),
  dotLive: cssObj({
    width: '$1',
    height: '$1',
    borderRadius: '50%',
    border: '1px solid #A9F6D5',
    background: '#00F58C',
    boxShadow: '0px 0px 4px 0px #00F58C',
  }),
  dotBuilding: cssObj({
    width: '$1',
    height: '$1',
    borderRadius: '50%',
    border: '1px solid #E5C06F',
    background: '#F3B42C',
    boxShadow: '0px 0px 4px 0px #F3B42C',
  }),
  button: cssObj({
    position: 'absolute',
    top: '217px',
    left: '125px',
    border: '1px solid $intentsBase8',
    backgroundColor: '$intentsBase1',
    borderRadius: '5px',
    zIndex: '1',
  }),
  alert: cssObj({
    //paddingTop: '10px',
  }),
  divider: cssObj({
    height: '1px',
    width: '100%',
    position: 'relative',
    backgroundColor: '$intentsBase6',
    marginBottom: '5px',
    overflow: 'visible',
  }),
};
