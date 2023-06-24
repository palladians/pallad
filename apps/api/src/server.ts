import { httpServer } from './app'

const PORT = import.meta.env?.PORT || 3333

httpServer.listen(PORT)
