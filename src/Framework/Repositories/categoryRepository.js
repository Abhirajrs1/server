import { Category } from "../../Core/Entities/categoryCollection.js";
import logger from "../Utilis/logger.js";


const categoryRepository={

    findExistingCategory:async(categoryName)=>{
        try {
            const existingCategory=await Category.findOne({categoryName:new RegExp(`^${categoryName}$`, 'i')})
            logger.info(`Category found: ${categoryName}`);
            return existingCategory
        } catch (error) {
            logger.error(`Error finding category: ${error.message}`);
        }
    },
    addNewCategory:async(categoryData)=>{
        try {
            const newCategory=new Category(categoryData)
            await newCategory.save()
            logger.info(`Category added successfully: ${JSON.stringify(newCategory)}`);
            return newCategory
        } catch (error) {
            logger.error(`Error adding new category: ${error.message}`);
        }
    },
    getCategories:async(page,limit)=>{
        try {
            const skip=(page-1)*limit
            const categories=await Category.find().skip(skip).limit(limit)
            const total=await Category.countDocuments()
            logger.info(`Retrieved ${categories.length} categories, Total categories: ${total}`);
            return {categories,total}
        } catch (error) {
            logger.error(`Error retrieving categories: ${error.message}`);
        }
    }


}
export default categoryRepository