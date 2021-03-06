import React from 'react'

import { version } from '../../../../../../app.json'
import { NavigationScreen } from 'src/ui/types'
import Logic, { Props, State, Event } from './logic'
import SettingsMenu from '../../components/settings-menu'
import SettingsLink from '../../components/settings-link'
import OutLink from '../../components/out-link'

export default class SettingsMenuScreen extends NavigationScreen<
    Props,
    State,
    Event
> {
    constructor(props: Props) {
        super(props, { logic: new Logic(props) })
    }

    private handleSyncPress = () => {
        if (this.state.isSynced) {
            this.processEvent('syncNow', {})
        } else {
            this.props.navigation.navigate('Sync')
        }
    }

    private navigateTo = (
        route: 'Pairing' | 'Overview' | 'Onboarding',
    ) => () => {
        this.props.navigation.navigate(route)
    }

    render() {
        return (
            <SettingsMenu
                isPaired={this.state.isSynced}
                versionCode={version}
                onDevicePairedPress={this.navigateTo('Pairing')}
                onExitPress={this.navigateTo('Overview')}
                onSyncPress={this.handleSyncPress}
                isSyncing={this.state.syncState === 'running'}
            >
                <SettingsLink onPress={this.navigateTo('Onboarding')}>
                    Tutorial
                </SettingsLink>
                <OutLink
                    url={
                        'https://www.notion.so/worldbrain/Release-Notes-Roadmap-262a367f7a2a48ff8115d2c71f700c14'
                    }
                >
                    Changelog & Feature Roadmap
                </OutLink>
                <OutLink
                    url={'https://community.worldbrain.io/c/bug-reports'}
                    skipBottomBorder
                >
                    Report Bugs
                </OutLink>
            </SettingsMenu>
        )
    }
}
