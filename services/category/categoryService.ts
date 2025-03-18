import API from "../api";


class CategoryService {

    baseUrl = "/category"


    async getAllCategories() {
        try {
            const response = await API.get(`${this.baseUrl}`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getAllCategories :: error', error.response?.data)
            return error.response?.data;
        }
    }

    async getCategoryById(slug: string) {
        try {
            const response = await API.get(`${this.baseUrl}/${slug}`);

            return response.data;
        } catch (error: any) {
            console.log('API :: getCategoryById :: error', error.response?.data)
            return error.response?.data;
        }
    }
}

const categoryService = new CategoryService()

export default categoryService;
