import { Image } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

// eslint-disable-next-line prettier/prettier
interface UserPhotoProps extends ComponentProps<typeof Image> { }

export function UserPhoto({ ...rest }: UserPhotoProps) {
  return (
    <Image
      {...rest}
      rounded="$full"
      borderWidth="$2"
      borderColor="$gray400"
      backgroundColor="$gray500"
    />
  )
}
