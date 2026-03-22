import { Constantes } from '@/config/Constantes'
import { io } from 'socket.io-client'

const URL = Constantes.socketUrl

export const socket = io(URL, {
  transports: ['websocket'],
})
