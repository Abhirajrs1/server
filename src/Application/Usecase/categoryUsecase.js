import categoryRepository from "../../Framework/Repositories/categoryRepository.js";
import logger from "../../Framework/Utilis/logger.js";

const categoryUseCase = {
    addCategory: async (formData) => {
        try {
            const { categoryName, description } = formData;
            const existingCategory = await categoryRepository.findExistingCategory(categoryName);
            
            if (existingCategory) {
                logger.warn(`Category already exists: ${categoryName}`);
                return { message: "Category already exists" };
            }
            
            const newCategory = await categoryRepository.addNewCategory({
                categoryName: categoryName,
                categoryDescription: description
            });
            
            logger.info("Category added successfully");
            return newCategory;
        } catch (error) {
            logger.error(`Error in adding category: ${error.message}`);
        }
    },
    getAllCategories:async(page,limit)=>{
        try {
            const {categories,total}=await categoryRepository.getCategories(page,limit)
            if(!categories){
                logger.warn("No categories found");
                return { message: "Categories not found" };
            }else{
                logger.info(`Categories retrieved successfully - Total: ${total}, Page: ${page}, Limit: ${limit}`);
                return {categories,total,page,limit}
            }
        } catch (error) {
            logger.error(`Error in fetching categories: ${error.message}`);
        }
    }
};

export default categoryUseCase;
