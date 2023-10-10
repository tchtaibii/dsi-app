import { atom } from 'recoil';

export const myData = atom({
    key: 'myData', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
});