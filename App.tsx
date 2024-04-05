import React, { useEffect, useRef } from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './src/theme';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigators/main';
import { persistor, store } from './src/store';
import { Provider } from 'react-redux';
import InfoModal from './src/components/shared/infoModal';
import pushNotifications, {
  ReceivedNotification,
} from 'react-native-push-notification';
import { Platform } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';


export default function App() {
  const navigationRef = useRef<any>()

  useEffect(() => {

    if (navigationRef) {

      pushNotifications.configure({
        onRegister: function (token) {
          console.log('token', token);
          console.log()
        },
        onNotification: function (
          notification
        ) {
          console.log('notification', notification);
          if (notification.data.path) {
            if (notification.userInteraction === true) {
              const params = notification.data.params || {}
              navigationRef.current?.navigate(notification.data.path, { ...params });
            }
          }
        },
        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION:', notification);

          // process the action
        },
        requestPermissions: Platform.OS === 'ios',
      });


      pushNotifications.channelExists('channel-id', function (exists) {
        console.log("exist", exists); // true/false
        if (!exists) {
          console.log("dont exist")
          pushNotifications.createChannel(
            {
              channelId: 'channel-id',
              channelName: 'barbershop',
            },
            created => console.log('created', created),
          );
        }
      })

    }
  }, [navigationRef])


  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>

          <GluestackUIProvider config={config}>
            <NavigationContainer ref={navigationRef}>
              <MainNavigator />
            </NavigationContainer>
            <InfoModal />
          </GluestackUIProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
