import {Heading, Box, HStack, VStack} from '@gluestack-ui/themed';

import React from 'react';
import BaseInput from '../../components/shared/baseInput';
import BaseButton from '../../components/shared/baseButton';
import {useForm, Controller} from 'react-hook-form';
import {useAppDispatch} from '../../store';
import {setUser} from '../../store/features/authSlice';
import {barber} from '../../dummy-data/barbers';

interface Form {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useAppDispatch();

  const {
    formState: {errors},
    handleSubmit,
    control,
    watch
  } = useForm<Form>();
  const submit = (values: Form): void => {
    console.log("submit")
    dispatch(
      setUser({
        ...barber,
        token: 'token',
      }),
    );
  };

  return (
    <Box flex={1} bg="$primary100" p={'$4'}>
      <VStack flex={1} justifyContent="center">
        <Box bg="$white" borderRadius={16} p="$4">
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
              rules={{required: 'Campo requerido'}}
            />
          </Box>
          <Box mb="$4">
            <Controller
              name="password"
              control={control}
              render={({field, fieldState}) => {
                return (
                  <BaseInput
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
              disabled={false}
              hasIcon={false}
              isLoading={false}
            />
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
