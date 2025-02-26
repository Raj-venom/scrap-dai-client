import { login, logout } from "@/contexts/features/auth/authSlice";
import authService from "@/services/auth";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Index() {
  const dispatch = useDispatch()
  const authStatus = useSelector((state: any) => state.auth.status)
  const userData = useSelector((state: any) => state.auth.userData)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    setLoading(true)
    authService.getCurrentUser().then((response) => {
      if (response.success) {
        dispatch(login({ userData: response.data }))
      } else {
        dispatch(logout())
      }
    }).finally(() => {
      setLoading(false)
    })

  }, [])


  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!loading && authStatus) {
    return (
      <Redirect href="/(user)" />
    )
  }
  
  if (!loading && !authStatus) {
    return (
      <Redirect href="/(auth)/welcome" />
    )
  }
}
