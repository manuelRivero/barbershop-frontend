/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import pushNotifications, {
    ReceivedNotification,
  } from 'react-native-push-notification';
  import {Platform} from 'react-native';

AppRegistry.registerComponent(appName, () => App);

pushNotifications.configure({
    onRegister: function (token) {
      console.log('token', token);
    },
    onNotification: function (
      notification
    ) {
      console.log('notification', notification);
    },
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // process the action
    },
    requestPermissions: Platform.OS === 'ios',
  });


  pushNotifications.channelExists('channel-id', function (exists) {
    console.log(exists); // true/false
    if(!exists){
      pushNotifications.createChannel(
        {
          channelId: 'channel-id',
          channelName: 'barbershop',
        },
        created => console.log('created', created),
      );
    }
  })

