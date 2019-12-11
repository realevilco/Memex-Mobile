import { Services } from './types'

export function setupBackgroundSync({ services }: { services: Services }) {
    services.backgroundProcess.scheduleProcess(async () => {
        // TODO: figure out how to properly schedule a continuous sync batch
        await services.sync.continuousSync.maybeDoIncrementalSync()

        // TODO: figure out whether the DB was written to (still don't understand how important this is)
        return { newData: true }
    })
}
