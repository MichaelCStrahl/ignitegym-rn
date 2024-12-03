import {
  FormControlError,
  Input as GlueStackInput,
  InputField,
  FormControl,
  FormControlErrorText,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

interface InputProps extends ComponentProps<typeof InputField> {
  errorMessage?: string | null
  isInvalid?: boolean
  isReadOnly?: boolean
}

export function Input({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}: InputProps) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl w="$full" mb="$2" isInvalid={invalid}>
      <GlueStackInput
        isInvalid={isInvalid}
        h="$14"
        borderWidth="$1"
        borderColor="transparent"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? '$red500' : '$green500',
        }}
        $invalid={{
          borderWidth: 1,
          borderColor: '$red500',
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          px="$4"
          bg="$gray700"
          color="$white"
          fontFamily="$body"
          placeholderTextColor="$gray300"
          {...rest}
        />
      </GlueStackInput>

      <FormControlError>
        <FormControlErrorText color="$red500">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}
