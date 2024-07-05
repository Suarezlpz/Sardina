import { atom } from 'jotai'
import dayjs from 'dayjs';
export const fechaInicioAtom = atom(dayjs())
export const fechaFinAtom = atom(dayjs())