export function shortAddress(address: string = '', minLength = 10) {
  return address.length > minLength
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}
