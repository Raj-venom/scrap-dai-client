import { USER_ROLE } from "@/constants";
import { login, logout } from "@/contexts/features/auth/authSlice";
import collectorAuthService from "@/services/collector/collectorAuth";
import { getRole } from "@/services/token/tokenService";
import userAuthService from "@/services/user/auth";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Index() {
  const dispatch = useDispatch()
  const authStatus = useSelector((state: any) => state.auth.status)
  const userData = useSelector((state: any) => state.auth.userData)
  const [loading, setLoading] = useState(true)


  const currentUser = async () => {
    setLoading(true)
    try {
      const role = await getRole();

      if (role === USER_ROLE.USER) {
        const response = await userAuthService.getCurrentUser()

        if (response.success) {
          dispatch(login({ userData: response.data }))
        } else {
          Alert.alert('Error', response.message)
          dispatch(logout())
        }

      } else if (role === USER_ROLE.COLLECTOR) {
        const response = await collectorAuthService.getCurrentUser()

        if (response.success) {
          dispatch(login({ userData: response.data }))
        } else {
          Alert.alert('Error', response.message)
          dispatch(logout())
        }
      } else {
        console.log('Role not found');
        dispatch(logout())
      }

    } catch (error) {
      dispatch(logout())

    } finally {
      setLoading(false)
    }



  }


  useEffect(() => {
    ; (async () => {
      await currentUser()
    }
    )()
  }, [dispatch]);


  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>


      </View>
    )
  }

  if (!loading && authStatus && userData.role === USER_ROLE.USER) {

    return (
      <Redirect href="/(user)/(tabs)/home" />
    )
  }
  if (!loading && authStatus && userData.role === USER_ROLE.COLLECTOR) {
    return (
      <Redirect href="/(collector)/(tabs)/home" />
    )
  }



  if (!loading && !authStatus) {
    return (
      <Redirect href="/(auth)/welcome" />
    )
  }
}
