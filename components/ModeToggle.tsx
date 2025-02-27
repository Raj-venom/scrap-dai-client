import { USER_ROLE } from '@/constants';
import { userMode } from '@/contexts/features/auth/authSlice';
import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ModeToggle = () => {
  const mode = useSelector((state: any) => state.auth.userMode)
  const [isCollectorMode, setIsCollectorMode] = useState<boolean>(mode === USER_ROLE.COLLECTOR);
  const dispatch = useDispatch()


  const toggleRole = () => {
    setIsCollectorMode((prev) => !prev);

    dispatch(userMode({ userMode: isCollectorMode ? USER_ROLE.USER : USER_ROLE.COLLECTOR }));
  };


  return (
    <View className="flex flex-row gap-1 items-center">
      <Switch
        trackColor={{ false: '#d1d5db', true: '#22c55e' }}
        thumbColor="#ffffff"
        onValueChange={toggleRole}
        value={isCollectorMode}
      />
      <Text className="text-black font-semibold text-lg">
        {isCollectorMode ? 'Collector Mode' : 'User Mode'}
      </Text>
    </View>

  );
};

export default ModeToggle;
