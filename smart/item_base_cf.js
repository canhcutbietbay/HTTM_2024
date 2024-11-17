// (Nguyên liệu
// Vùng miền(cuisine - area)
// Category
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));

    return dotProduct / (magnitudeA * magnitudeB);
};

const createRecipeVector = (recipe, allIngredients, allCategory, allArea) => {
    // Tạo vector nhị phân cho công thức với nguyên liệu, thể loại, vùng miền
    let vector = [];
    if (Array.isArray(allIngredients)) {
        allIngredients.forEach(ingredient => {
            vector.push(recipe.Ingredients.includes(ingredient) ? 1 : 0);
        });
    }
    if (Array.isArray(allCategory)) {
        allCategory.forEach(category => {
            vector.push(recipe.Category === category ? 1 : 0);
        });
    }
    if (Array.isArray(allArea)) {
        allArea.forEach(area => {
            vector.push(recipe.Area === area ? 1 : 0);
        });
    }
    return vector;
};
// Kiểm tra xem công thức đã tồn tại chưa
function isRecipeIdExist(id, recipes) {
    return recipes.some(recipe => recipe.Id_recipe === id);
}
const recommendRecipes = (userLikedRecipes, allRecipes, allIngredients, allCategory, allArea) => {
    const recommendations = [];
    // Tạo vector cho các công thức người dùng đã thích
    const likedRecipesVectors = userLikedRecipes.map(recipe => createRecipeVector(recipe, allIngredients, allCategory, allArea));
    // Đánh giá độ tương đồng giữa các công thức người dùng đã thích và tất cả các công thức
    allRecipes.forEach(recipe => {
        const recipeVector = createRecipeVector(recipe, allIngredients, allCategory, allArea);
        let similarityScore = 0;
        // Tính độ tương đồng với từng công thức người dùng đã thích
        likedRecipesVectors.forEach(likedRecipeVector => {
            similarityScore += cosineSimilarity(likedRecipeVector, recipeVector);
        });
        // Nếu độ tương đồng cao (có thể đặt ngưỡng để chọn các công thức tốt)
        if (similarityScore > 0 && !isRecipeIdExist(recipe.Id, userLikedRecipes) && !isRecipeIdExist(recipe.Id_recipe, userLikedRecipes)) {
            recipe.similarity = similarityScore
            recommendations.push({
                recipe,
                // similarityScore
            });
        }
    });
    // Sắp xếp các công thức theo độ tương đồng giảm dần
    recommendations.sort((a, b) => b.recipe.similarity - a.recipe.similarity);
    return recommendations.map(rec => rec.recipe);
    // return recommendations
};

// Đề xuất công thức cho người dùng
const itemBaseCF = function (userLikedRecipes, allRecipes, allIngredients, allCategory, allArea) {
    const recommendedRecipes = recommendRecipes(userLikedRecipes, allRecipes, allIngredients, allCategory, allArea);
    return recommendedRecipes.slice(0, 10)
}

export default itemBaseCF