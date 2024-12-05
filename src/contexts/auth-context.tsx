import { UserDTO } from '@dtos/user-dto'
import { api } from '@services/api'
import { storageAuthTokenSave } from '@storage/storage-auth-token'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storage-user'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

export type AuthContextDataProps = {
  user: UserDTO
  isLoadingUserStorageData: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  const storageUserAndToken = async (userData: UserDTO, token: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      setIsLoadingUserStorageData(true)

      api.defaults.headers.common.Authorization = 'Bearer ' + token

      await storageUserSave(userData)
      await storageAuthTokenSave(token)

      setUser(userData)
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      })

      if (data.user && data.token) {
        storageUserAndToken(data.user, data.token)
      }
    } catch (error) {
      throw error
    }
  }

  const loadUserData = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const userLogged = await storageUserGet()

      if (userLogged) {
        setUser(userLogged)
      }
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signOut = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)

      await storageUserRemove()
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  return context
}
