// import React from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
// import { router, Slot, usePathname } from 'expo-router';
// import ProgressSteps from '@/components/ProgressSteps';
// import { Ionicons } from '@expo/vector-icons';

// export default function AppLayout() {
//   const pathname = usePathname();

//   // Get current step number from the pathname
//   const getCurrentStep = () => {
//     if (pathname === '/select-material') return 1;
//     if (pathname === '/select-category') return 2;
//     if (pathname === '/estimate-price') return 3;
//     if (pathname === '/date-location') return 4;
//     if (pathname === '/payment-option') return 5;
//     return 1;
//   };

//   return (
//     <View className="flex-1 bg-white">

//       <View className="pt-4 pb-3 px-4 flex-row items-center border-b border-gray-200">
//         <TouchableOpacity onPress={() => router.back()} className="mr-4">
//           <Ionicons name="chevron-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg ml-28 font-semibold">Sell your Scrap</Text>
//       </View>

//       {/* Fixed Progress Bar */}
//       <ProgressSteps currentStep={getCurrentStep()} />


//       {/* Content area that will change based on the route */}
//       <Slot />

//       {/* Next button */}
//       {/* <View className="p-4">
//         <TouchableOpacity
//           className="bg-green-500 h-12 w-12 rounded-full items-center justify-center self-end"
//           onPress={() => router.push('/select-category')}
//         >
//           <Ionicons name="arrow-forward" size={24} color="white" />
//         </TouchableOpacity>
//       </View> */}
//     </View>
//   );
// }


import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router, Slot, usePathname } from 'expo-router';
import ProgressSteps from '@/components/ProgressSteps';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const pathname = usePathname();

  // Get current step number from the pathname
  const getCurrentStep = () => {
    if (pathname === '/select-material') return 1;
    if (pathname === '/select-category') return 2;
    if (pathname === '/estimate-price') return 3;
    if (pathname === '/date-location') return 4;
    if (pathname === '/payment-option') return 5;
    return 1;
  };

  return (
    <View className="flex-1 bg-white">

      <View className="pt-4 pb-3 px-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg ml-28 font-semibold">Sell your Scrap</Text>
      </View>

      {/* Fixed Progress Bar */}
      <ProgressSteps currentStep={getCurrentStep()} />


      {/* Content area that will change based on the route */}
      <Slot />

      {/* Next button */}
      {/* <View className="p-4">
        <TouchableOpacity
          className="bg-green-500 h-12 w-12 rounded-full items-center justify-center self-end"
          onPress={() => router.push('/select-category')}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}