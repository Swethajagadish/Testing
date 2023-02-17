import { SharedArray } from 'k6/data';

export const Devices = new SharedArray('User Devices', function () {
    return JSON.parse(open('../data/devices.json')).devices;
});
