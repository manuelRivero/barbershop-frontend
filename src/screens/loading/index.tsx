import React, {useCallback, useEffect, useState} from 'react';
import Loader from '../../components/shared/loader';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {useGetServicesQuery} from '../../api/servicesApi';
import {addAllServices} from '../../store/features/servicesSlice';
import {Box} from 'lucide-react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {VStack} from '@gluestack-ui/themed';
import {
  PERMISSIONS,
  check,
  request,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Loading() {
  const [newCheckStatus, setNewCheckStatus] = useState<any>('');
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const {data, isLoading} = useGetServicesQuery();

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  useEffect(() => {
    if (data) {
      dispatch(addAllServices(data.services));
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      const chechForPermissions = async () => {
        const platform = Platform.Version;
        if (parseInt(`${platform}`) >= 33) {
          const hasPermissions = await checkNotificationPermission();
          if (hasPermissions !== RESULTS.GRANTED) {
            dispatch(
              showInfoModal({
                title: '¡Necesitamos permisos para enviarte notificaciones!',
                type: 'info',
                hasCancel: false,
                cancelCb: null,
                hasSubmit: true,
                submitCb: async () => {
                  const permissionRequest =
                    await requestNotificationPermission();
                  if (permissionRequest !== RESULTS.GRANTED) {
                    dispatch(
                      showInfoModal({
                        title:
                          'Ve a configuración y activa las notificaciones para poder continuar',
                        type: 'error',
                        hasCancel: false,
                        cancelCb: null,
                        hasSubmit: true,
                        submitCb: async () => {
                          openSettings();
                          dispatch(hideInfoModal());
                        },
                        hideOnAnimationEnd: false,
                        submitData: {
                          text: 'Ir a configuración',
                          background: '$primary500',
                        },
                      }),
                    );
                  } else {
                    dispatch(hideInfoModal());
                    navigation.navigate('BottomsTabs');
                  }
                },
                hideOnAnimationEnd: false,
                submitData: {
                  text: 'Dar permisos',
                  background: '$primary500',
                },
              }),
            );
          } else {
            dispatch(hideInfoModal());
            navigation.navigate('BottomsTabs');
          }
        } else {
          dispatch(hideInfoModal());
          navigation.navigate('BottomsTabs');
        }
      };
      chechForPermissions();
    }, []),
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const hasPermissions = await checkNotificationPermission();
      if (hasPermissions === RESULTS.GRANTED) {
        setNewCheckStatus(hasPermissions);
        dispatch(hideInfoModal());
        navigation.navigate('BottomsTabs');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [newCheckStatus]);

  return <Loader />;
}
