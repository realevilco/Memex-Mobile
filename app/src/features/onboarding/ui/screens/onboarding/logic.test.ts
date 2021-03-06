import { storageKeys } from '../../../../../../app.json'
import { LocalStorageService } from 'src/services/local-storage'
import { OnboardingStage } from 'src/features/onboarding/types'
import OnboardingScreenLogic from './logic'
import { TestLogicContainer } from 'src/tests/ui-logic'
import { FakeNavigation } from 'src/tests/navigation'
import { MockSettingsStorage } from 'src/features/settings/storage/mock-storage'

describe('onboarding UI logic tests', () => {
    function setup() {
        const navigation = new FakeNavigation()
        const localStorage = new LocalStorageService({
            settingsStorage: new MockSettingsStorage(),
        })
        const logic = new OnboardingScreenLogic({
            navigation: navigation as any,
            services: {
                localStorage,
            },
        })
        const logicContainer = new TestLogicContainer(logic)

        return { logicContainer, localStorage, navigation }
    }

    it('should do the whole onboarding flow correctly for an unsynced device', async () => {
        const { logicContainer, localStorage, navigation } = setup()

        expect(logicContainer.state).toEqual({
            isSynced: false,
            onboardingStage: 0,
        })

        await logicContainer.processEvent('goToNextStage', {})
        expect(logicContainer.state).toEqual({
            isSynced: false,
            onboardingStage: 1,
        })
        await logicContainer.processEvent('goToNextStage', {})
        expect(logicContainer.state).toEqual({
            isSynced: false,
            onboardingStage: 2,
        })

        expect(await localStorage.get(storageKeys.showOnboarding)).toEqual(null)
        await logicContainer.processEvent('goToNextStage', {})
        expect(navigation.popRequests()).toEqual([
            { type: 'navigate', target: 'Sync' },
        ])
        expect(await localStorage.get(storageKeys.showOnboarding)).toEqual(
            false,
        )
    })
})
