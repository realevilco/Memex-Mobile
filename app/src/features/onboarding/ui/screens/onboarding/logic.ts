import { UILogic, UIEvent, IncomingUIEvent, UIMutation } from 'ui-logic-core'

import { storageKeys } from '../../../../../../app.json'
import { OnboardingStage } from 'src/features/onboarding/types'
import { UIServices } from 'src/ui/types'

export interface State {
    onboardingStage: OnboardingStage
    isSynced: boolean
}

export type Event = UIEvent<{
    finishOnboarding: { nextView: 'Sync' | 'Overview' }
    goToLastStage: {}
    goToNextStage: {}
    goToPrevStage: {}
}>

export interface Props {
    services: UIServices<'localStorage' | 'navigation'>
}

export default class OnboardingScreenLogic extends UILogic<State, Event> {
    static MAX_ONBOARDING_STAGE: OnboardingStage = 3

    constructor(
        private props: {
            services: UIServices<'localStorage' | 'navigation'>
        },
    ) {
        super()
    }

    getInitialState(): State {
        return { onboardingStage: 0, isSynced: false }
    }

    async init() {
        const syncKey = await this.props.services.localStorage.get<string>(
            storageKeys.syncKey,
        )

        if (syncKey != null) {
            this.emitMutation({ isSynced: { $set: true } })
        }
    }

    async finishOnboarding(
        incoming: IncomingUIEvent<State, Event, 'finishOnboarding'>,
    ) {
        const { localStorage, navigation } = this.props.services

        await localStorage.set(storageKeys.showOnboarding, false)

        await navigation.navigate(incoming.event.nextView)
    }

    goToLastStage(
        incoming: IncomingUIEvent<State, Event, 'goToLastStage'>,
    ): UIMutation<State> {
        return {
            onboardingStage: {
                $set: (OnboardingScreenLogic.MAX_ONBOARDING_STAGE -
                    1) as OnboardingStage,
            },
        }
    }

    goToNextStage(
        incoming: IncomingUIEvent<State, Event, 'goToNextStage'>,
    ): UIMutation<State> {
        const nextStage = (incoming.previousState.onboardingStage +
            1) as OnboardingStage

        if (nextStage >= OnboardingScreenLogic.MAX_ONBOARDING_STAGE) {
            this.processUIEvent('finishOnboarding', {
                ...incoming,
                event: { nextView: 'Sync' },
            })
            return {}
        }

        return { onboardingStage: { $set: nextStage } }
    }

    goToPrevStage(
        incoming: IncomingUIEvent<State, Event, 'goToPrevStage'>,
    ): UIMutation<State> {
        return {
            onboardingStage: {
                $set: (incoming.previousState.onboardingStage -
                    1) as OnboardingStage,
            },
        }
    }
}
