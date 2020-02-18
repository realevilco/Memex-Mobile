import React from 'react'
import { Alert } from 'react-native'

import SyncSuccess from 'src/features/sync/ui/components/sync-success-stage'
import { storageKeys } from '../../../../../../app.json'
import { StatefulUIElement, UIServices } from 'src/ui/types'

interface Props {
    services: UIServices<'localStorage' | 'navigation'>
}

export default class RePairScreen extends StatefulUIElement<Props, {}, Event> {
    private handleRePairConfirmation = async () => {
        await this.props.services.localStorage.clear(storageKeys.syncKey)
        this.props.services.navigation.navigate('Sync')
    }

    private handleRePairChoice = () => {
        Alert.alert('Are you sure you want to do that?', `You can't go back`, [
            { text: 'Cancel' },
            { text: 'OK', onPress: this.handleRePairConfirmation },
        ])
    }

    private handleBackPress = () => {
        this.props.services.navigation.navigate('Overview')
    }

    render() {
        return (
            <SyncSuccess
                allowRePairing
                onBtnPress={this.handleRePairChoice}
                onBackBtnPress={this.handleBackPress}
            />
        )
    }
}
