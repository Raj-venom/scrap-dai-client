import { ScrapCategory } from '@/types/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PickupAddress {
    formattedAddress: string;
    latitude: number | null;
    longitude: number | null;
}

interface ScrapImage {
    uri: string;
    type: string;
    id: string;
}

interface SubCategoryWithWeight {
    _id: string;
    weight: string;
}

interface OrderState {
    selectedScrapCategoryWithSubCategory: ScrapCategory[];
    selectedCategory: string[];
    selectedSubCategory: string[];
    pickupDate: string;
    pickupAddress: PickupAddress;
    scrapImages: ScrapImage[];
    selectedSubCategoryWithWeights: SubCategoryWithWeight[];

}

const initialState: OrderState = {
    selectedScrapCategoryWithSubCategory: [],
    selectedCategory: [],
    selectedSubCategory: [],
    pickupDate: '',
    pickupAddress: {
        formattedAddress: '',
        latitude: null,
        longitude: null,
    },
    scrapImages: [],
    selectedSubCategoryWithWeights: [],
};


const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<string[]>) => {
            state.selectedCategory = action.payload;
        },
        setSelectedSubCategory: (state, action: PayloadAction<string[]>) => {
            state.selectedSubCategory = action.payload;
        },
        setPickupDate: (state, action: PayloadAction<string>) => {
            state.pickupDate = action.payload;
        },
        setPickupAddress: (state, action: PayloadAction<PickupAddress>) => {
            state.pickupAddress = action.payload;
        },
        setSelectedScrapCategoryWithSubCategory: (state, action: PayloadAction<any[]>) => {
            state.selectedScrapCategoryWithSubCategory = action.payload;
        },
        setScrapImages: (state, action: PayloadAction<ScrapImage[]>) => {
            state.scrapImages = action.payload;
        },
        setSelectedSubCategoryWithWeights: (state, action: PayloadAction<SubCategoryWithWeight[]>) => {
            state.selectedSubCategoryWithWeights = action.payload;
        },
        resetOrderState: () => initialState,

    },
});

export const {
    setSelectedCategory,
    setSelectedSubCategory,
    setPickupDate,
    setPickupAddress,
    setSelectedScrapCategoryWithSubCategory,
    setScrapImages,
    setSelectedSubCategoryWithWeights,
    resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;