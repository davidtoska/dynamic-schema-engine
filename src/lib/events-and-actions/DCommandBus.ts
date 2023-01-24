import { DCommand } from './DCommand'
import { DTimestamp } from '../common/DTimestamp'

export class DCommandBus {
  private readonly TAG = ' [ COMMAND_BUS ] '
  private readonly commandLog: Array<DCommand & { timestamp: DTimestamp }> = []
  readonly subscribers = new Set<(event: DCommand) => void>()
  // readonly sub

  subscribe(cb: (command: DCommand) => void) {
    this.subscribers.add(cb)
    return () => {
      this.subscribers.delete(cb)
    }
  }

  emit(command: DCommand) {
    const timestamp = DTimestamp.now()
    this.commandLog.push({ ...command, timestamp })
    console.log(command.kind, command.payload)

    this.subscribers.forEach((cb) => {
      cb(command)
    })
  }
}
