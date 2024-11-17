const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));

    return dotProduct / (magnitudeA * magnitudeB);
};

const createRecipeVector = (userRecipe, allRecipes) => {
    // Tạo vector nhị phân giữa người dùng và tất cả công thức
    let vector = [];

    if (Array.isArray(allRecipes)) {
        allRecipes.forEach(recipe => {
            vector.push(userRecipe.includes(recipe.Id) ? 1 : 0);
        });
    }
    return vector;
};

const recommendRecipes = (userLikedRecipes, recipesByUser, allRecipes) => {
    const recommendations = [];
    // Tạo vector cho các công thức người dùng đã thích
    const likedRecipesVectors = createRecipeVector(userLikedRecipes, allRecipes);
    // Đánh giá độ tương đồng giữa người dùng hiện tại và các người dùng trong hệ thống
    recipesByUser.forEach(user => {
        const recipeVector = createRecipeVector(user.recipe_ids, allRecipes);
        let similarityScore = 0;
        // Tính độ tương đồng với người dùng hiện tại với các người dùng khác trong hệ thống
        similarityScore = cosineSimilarity(likedRecipesVectors, recipeVector);
        // Nếu độ tương đồng cao (có thể đặt ngưỡng để chọn các người dùng phù hợp)
        if (similarityScore > 0) {
            user.similarity = similarityScore
            recommendations.push({
                user,
                // similarityScore
            });
        }
    });
    // Sắp xếp người dùng theo độ tương đồng giảm dần
    recommendations.sort((a, b) => b.user.similarity - a.user.similarity);
    return recommendations.map(rec => rec.user);
    // return recommendations
};

// Đề xuất công thức cho người dùng
const userBaseCF = function (userLikedRecipes, recipesByUser, allRecipes) {
    const recommendedRecipes = recommendRecipes(userLikedRecipes, recipesByUser, allRecipes);
    const mostSimilarRecipe = recommendedRecipes
        .filter(recipe => recipe.similarity < 0.99)
        .reduce((maxRecipe, recipe) => (recipe.similarity > maxRecipe.similarity ? recipe : maxRecipe), { similarity: -Infinity });
    if (mostSimilarRecipe.similarity > 0)
        return mostSimilarRecipe.user_id
    else return 0
}

export default userBaseCF