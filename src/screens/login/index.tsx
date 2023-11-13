import React, {useState} from 'react';
import {Heading, Box, HStack, VStack} from '@gluestack-ui/themed';

import BaseInput from '../../components/shared/baseInput';
import BaseButton from '../../components/shared/baseButton';
import {useForm, Controller} from 'react-hook-form';
import {useAppDispatch} from '../../store';
import {setToken, setUser} from '../../store/features/authSlice';
import {authApi, useLoginMutation} from '../../api/authApi';
import {LoginManager, Settings, AccessToken} from 'react-native-fbsdk-next';
import {Divider} from '@gluestack-ui/themed';
import {useFacebookLoginMutation} from '../../api/facebookApi';

Settings.setAppID('315996248039279');

interface Form {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const [login, {isLoading, isError}] = useLoginMutation();
console.log("is error", isError)
  const [facebookLogin, {isLoading: isLoadingFacebook}] =
    useFacebookLoginMutation();

  const {
    formState: {errors},
    handleSubmit,
    control,
    watch,
  } = useForm<Form>();
  const submit = async (values: Form): Promise<void> => {
    try {
      const response = await login(values).unwrap();
      dispatch(setToken(response.token));
      const {data, isError} = await dispatch(
        authApi.endpoints.getMe.initiate(),
      );
      console.log("data", data)
      console.log("isError", isError)
      if (isError) {
        throw new Error();
      }
      dispatch(
        setUser({
          ...data?.data,
        }),
      );
    } catch (error) {
      console.log('error en el login', error);
    }
  };
  const handleFacebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      async function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' + result.grantedPermissions,
          );
          const token = await AccessToken.getCurrentAccessToken();
          console.log('token', token);
          try {
            const response = await facebookLogin({
              token: token?.accessToken,
            }).unwrap();
            dispatch(setToken(response.token));
            const {data, isError} = await dispatch(
              authApi.endpoints.getMe.initiate(),
            );
            if (isError) {
              throw new Error();
            }
            dispatch(
              setUser({
                ...data?.data,
              }),
            );
          } catch (error) {
            console.log('error al iniciar sesión con fb');
          }
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  return (
    <Box flex={1} bg="$primary100" p={'$4'}>
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Box bg="$white" borderRadius={16} p="$4" maxWidth={400} w={'$full'}>
          <Heading color="$textDark500" textAlign="center">
            Inicia sesión
          </Heading>
          <Box mb="$4">
            <Controller
              name="email"
              control={control}
              render={({field, fieldState}) => {
                return (
                  <BaseInput
                    keyboard="default"
                    label="Correo"
                    value={field.value}
                    onChange={e => field.onChange(e.nativeEvent.text)}
                    invalid={fieldState.error ? true : false}
                    errorMessage={
                      fieldState.error ? fieldState.error.message : undefined
                    }
                    placeholder="Ingresa tu correo"
                  />
                );
              }}
              rules={{
                required: 'Campo requerido',
                pattern: {
                  message: 'Correo invalido',
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                },
              }}
            />
          </Box>
          <Box mb="$4">
            <Controller
              name="password"
              control={control}
              render={({field, fieldState}) => {
                return (
                  <BaseInput
                    type="password"
                    keyboard="default"
                    label="Contraseña"
                    value={field.value}
                    onChange={e => field.onChange(e.nativeEvent.text)}
                    invalid={fieldState.error ? true : false}
                    errorMessage={
                      fieldState.error ? fieldState.error.message : undefined
                    }
                    placeholder="Ingresa tu contraseña"
                  />
                );
              }}
              rules={{
                required: 'Campo requerido',
              }}
            />
          </Box>
          <HStack justifyContent="center">
            <BaseButton
              title="Ingresar"
              background="$primary500"
              color="$white"
              onPress={handleSubmit(submit)}
              disabled={isLoading || isLoadingFacebook}
              hasIcon={false}
              isLoading={isLoading}
            />
          </HStack>
          <Divider my={'$4'} />
          <HStack justifyContent="center">
            <BaseButton
              title="Ingresar con facebook"
              background="$primary500"
              color="$white"
              onPress={handleFacebookLogin}
              disabled={isLoadingFacebook}
              hasIcon={false}
              isLoading={isLoadingFacebook}
            />
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
