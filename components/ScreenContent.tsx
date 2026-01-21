import React from 'react';
import { Text, View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';
import FarmDashboardInitialPage from '@/screens/MainApp';
import SignIn from '@/screens/SignIn';
import SignUp from '@/screens/SignUp';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className={styles.container}>
      {/* <Text className={styles.title}>{title}</Text> */}
      {/* <View className={styles.separator} /> */}
      {/* <Text className="text-3xl">Open up App.tsx to start working on your app!</Text> */}
      {/* <EditScreenInfo path={path} /> */}
      {children}
      {/* <FarmDashboardInitialPage /> */}
      {/* <SignIn /> */}
      <SignUp />
    </View>
  );
};
const styles = {
  container: `items-cente flex-1 justify-center bg-white`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
