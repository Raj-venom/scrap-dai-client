export default ({ config }) => {
    return {
        ...config,
        name: "client",
        slug: "client",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/logo.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: false,
        ios: {
            supportsTablet: true,
        },
        android: {
            package: "com.raj2323.scrapdai",
            adaptiveIcon: {
                foregroundImage: "./assets/images/logo.png",
                backgroundColor: "#ffffff",
            },
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY || "failed-to-load",
                },
            },
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/logo.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/logo.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                },
            ],
            "expo-font",
            [
                "expo-secure-store",
                {
                    configureAndroidBackup: true,
                    faceIDPermission: "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: "bf533bca-548f-4db3-82d0-b1b66ffb9109",
            },
        },
        owner: "raj2323",
    };
};