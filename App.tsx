import React from 'react';
import moment from 'moment-timezone';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from './src/theme';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/navigators/main';
import {store} from './src/store';
import {Provider} from 'react-redux';
import InfoModal from './src/components/shared/infoModal';

moment.tz.setDefault('America/Argentina/Buenos_Aires');

export default function App() {
  return (
    <>
      <Provider store={store}>
        <GluestackUIProvider config={config}>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
          <InfoModal />
        </GluestackUIProvider>
      </Provider>
    </>
  );
}
