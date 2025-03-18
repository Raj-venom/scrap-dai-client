import { TextInputProps, TouchableOpacityProps } from "react-native";



declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
    loading?: boolean;
}

declare interface GoogleInputProps {
    icon?: string;
    initialLocation?: string;
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: ({
        latitude,
        longitude,
        address,
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
    error?: string;
}


declare interface userRegisterProps {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}

declare interface Scrap {
    _id: string;
    name: string;
    description: string;
    image: string;
    pricePerKg: number;
    category: string;
}

declare interface ScrapCategory {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    scraps: Scrap[];
}
