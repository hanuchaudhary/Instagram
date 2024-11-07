import { atom } from 'recoil';

export const authTokenState = atom({
  key: 'authTokenState',  // unique ID (with respect to other atoms/selectors)
  default: localStorage.getItem('token') || '', // Default value, use localStorage if available
});
