



// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from "@expo/vector-icons";

// interface ScrapCategoryProps {
//   id: number;
//   type: string;
//   description: string;
//   iconName: string;
//   onSelect: (id: number) => void;
//   isSelected: boolean;
// }

// export default function ScrapCategory({
//   id,
//   type,
//   description,
//   iconName,
//   onSelect,
//   isSelected
// }: ScrapCategoryProps): JSX.Element {
//   return (
//     <TouchableOpacity
//       className={`w-1/3 p-2`}
//       onPress={() => onSelect(id)}
//     >
//       <View
//         className={`border rounded-md p-3 items-center justify-center h-32 ${isSelected
//             ? "border-blue-500 bg-blue-50"
//             : "border-gray-200"
//           }`}
//       >
//         <Ionicons
//           name={iconName as any}
//           size={24}
//           color={isSelected ? "#3b82f6" : "#333"}
//           className="mb-2"
//         />
//         <Text
//           className={`font-medium text-center ${isSelected ? "text-blue-600" : ""
//             }`}
//         >
//           {type}
//         </Text>
//         <Text className="text-xs text-gray-500 text-center mt-1">{description}</Text>

//         {isSelected && (
//           <View className="absolute top-2 right-2">
//             <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// }


import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface ScrapCategoryProps {
  id: number;
  type: string;
  description: string;
  iconName: string;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

export default function ScrapCategory({
  id,
  type,
  description,
  iconName,
  isSelected,
  onToggleSelect
}: ScrapCategoryProps): JSX.Element {
  return (
    <TouchableOpacity
      className="w-1/3 p-2"
      onPress={() => onToggleSelect(id)}
    >
      <View
        className={`border rounded-md p-3 items-center justify-center h-32 ${isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200"
          }`}
      >
        <Ionicons
          name={iconName as any}
          size={24}
          color={isSelected ? "#3b82f6" : "#333"}
          className="mb-2"
        />
        <Text
          className={`font-medium text-center ${isSelected ? "text-blue-600" : ""
            }`}
        >
          {type}
        </Text>
        <Text className="text-xs text-gray-500 text-center mt-1">{description}</Text>

        {isSelected && (
          <View className="absolute top-2 right-2">
            <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}