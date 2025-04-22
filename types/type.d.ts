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
    scrapImage: string;
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


declare interface UserStats {
    user: {
        _id: string;
        email: string;
        fullName: string;
        avatar: string;
    };
    totalCompletedOrders: number;
    totalWeight: number;
    totalEarnings: number;
    environmentalImpact: {
        energySaved: string;
        waterSaved: string;
        treesSaved: string;
        oreSaved: string;
        co2EmissionsReduced: string;
    }
}

declare interface CollectorStats {
    collector: {
        _id: string;
        email: string;
        fullName: string;
        avatar: string;
    };
    totalCompletedOrders: number;
    totalWeight: number;
    totalEarnings: number;

}



declare interface OrderRequest {
    pickupAddress: {
        formattedAddress: string;
        latitude: number;
        longitude: number;
    };
    _id: string;
    user: {
        _id: string;
        fullName: string;
    };
    collector: {
        _id: string;
        fullName: string;
    } | null;
    pickUpDate: string;
    status: string;
    estimatedAmount: number;
    orderItem: {
        scrap: {
            _id: string;
            name: string;
            pricePerKg: number;
        };
        weight: number;
        amount: number;
        _id: string;
    }[];
    scrapImage: string[];
    pickUpTime: string;
    contactNumber: string;
    timeline?: Array<{
        date: string;
        time: string;
        message: string;
        _id: string;
    }>;
}