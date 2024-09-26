import { Input as GlueStackInput, InputField } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

// eslint-disable-next-line prettier/prettier
interface InputProps extends ComponentProps<typeof InputField> { }

export function Input({ ...rest }: InputProps) {
  return (
    <GlueStackInput
      bg="$gray700"
      h="$14"
      px="$4"
      borderWidth="$1"
      borderColor="transparent"
      borderRadius="$md"
      $focus={{
        borderWidth: 1,
        borderColor: '$green500',
      }}
    >
      <InputField
        color="$white"
        fontFamily="$body"
        placeholderTextColor="$gray300"
        {...rest}
      />
    </GlueStackInput>
  )
}
