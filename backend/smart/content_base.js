// Tokenize và chuẩn hóa dữ liệu (chuyển thành chữ thường và loại bỏ ký tự đặc biệt)
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s,]/g, "")  // Loại bỏ các ký tự đặc biệt
        .split(/[\s,]+/);  // Tách từ theo dấu cách hoặc dấu phẩy
}
// Chuẩn hóa dữ liệu công thức
function preprocessRecipe(recipe) {
    // Kiểm tra xem Ingredients có phải là chuỗi không, nếu có thì chuyển thành mảng
    const ingredientsArray = Array.isArray(recipe.Ingredients)
        ? recipe.Ingredients
        : JSON.parse(recipe.Ingredients);  // Chuyển chuỗi JSON thành mảng nếu cần
    // Tokenize các thành phần Title (Name), Ingredients, Category, Area
    const titleTokens = tokenize(recipe.Name);
    const categoryTokens = tokenize(recipe.Category);
    const areaTokens = tokenize(recipe.Area);
    const ingredientsTokens = ingredientsArray.flatMap((ingredient) => tokenize(ingredient));  // Tokenize từng nguyên liệu trong Ingredients
    // Trả về một mảng kết hợp tất cả các từ đã token hóa (tách tất cả các từ ra rồi chuẩn hoá => array)
    return [
        ...titleTokens,
        ...ingredientsTokens,
        ...categoryTokens,
        ...areaTokens
    ];
}
// Tính TF (Term Frequency) cho danh sách từ ... số lần xuất hiện / tổng số từ
function computeTF(tokens) {
    const tf = {};
    const totalTokens = tokens.length;
    tokens.forEach((token) => {
        tf[token] = (tf[token] || 0) + 1 / totalTokens;  // Tính tỷ lệ tần suất
    });
    return tf;
}
// Tính IDF (Inverse Document Frequency) cho danh sách công thức
function computeIDF(allRecipes) {
    const documentCount = {};
    const totalDocuments = allRecipes.length;
    allRecipes.forEach((recipe) => {
        const tokens = new Set(preprocessRecipe(recipe)); // Sử dụng Set để loại bỏ từ trùng lặp
        tokens.forEach((token) => {
            documentCount[token] = (documentCount[token] || 0) + 1;  // Đếm số tài liệu chứa từ này
        });
    });
    const idf = {};
    Object.keys(documentCount).forEach((token) => {
        idf[token] = Math.log(totalDocuments / documentCount[token]);  // Tính IDF
    });
    return idf;
}
// Tính TF-IDF cho một vector từ
function computeTFIDF(tokens, idf) {
    const tf = computeTF(tokens);
    const tfidf = [];
    Object.keys(tf).forEach((token) => {
        const value = tf[token] * (idf[token] || 0);  // Tính TF-IDF
        tfidf.push(value);
    });
    // console.log(tokens)
    // console.log(tf)
    // console.log(tfidf)
    return tfidf;
}
// Vector hóa từ TF-IDF theo từ vựng chung
function alignVector(vocabulary, tfidf, combinedVocabulary) {
    return combinedVocabulary.map((word) => {
        const index = vocabulary.indexOf(word); // Tìm chỉ số của từ trong vocabulary
        if (index === -1) {
            return 0;  // Nếu không tìm thấy từ, trả về 0
        }
        return tfidf[index];  // Nếu tìm thấy, trả về giá trị từ tfidf tương ứng
    });
}
// Tính cosine similarity giữa hai vector TF-IDF
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);  // Công thức tính cosine similarity
};
// Chuẩn bị dữ liệu lịch sử tìm kiếm của người dùng
function preprocessSearchHistory(history) {
    return history.flatMap((item) => tokenize(item));
}
// Hàm gợi ý công thức cho người dùng dựa trên lịch sử tìm kiếm
function recommendRecipes(userSearchHistory, recipes) {
    const idf = computeIDF(recipes);  // Tính IDF từ danh sách công thức
    // Vector TF-IDF của lịch sử tìm kiếm
    const userTokens = Array.from(new Set(preprocessSearchHistory(userSearchHistory))); // Token hóa lịch sử
    const userTFIDF = computeTFIDF(userTokens, idf); // Tính TF-IDF cho lịch sử tìm kiếm

    // Tính độ tương đồng giữa lịch sử tìm kiếm và các công thức
    const res = []
    recipes
        .map((recipe) => {

            const recipeTokens = Array.from(new Set(preprocessRecipe(recipe)));
            const vocabulary = [...userTokens, ...recipeTokens];
            // Vector hóa cả user và recipe dựa trên từ vựng này
            const userVector = alignVector(userTokens, userTFIDF, vocabulary);
            const recipeVector = alignVector(recipeTokens, computeTFIDF(recipeTokens, idf), vocabulary);
            // Tính độ tương đồng cosine
            const similarity = cosineSimilarity(userVector, recipeVector);
            recipe.similarity = similarity
            res.push(recipe)
        })
    res.sort((a, b) => b.similarity - a.similarity);
    // Sắp xếp theo độ tương đồng
    return res.slice(0, 10);  // Trả về top 5 công thức có độ tương đồng cao nhất
}

export default recommendRecipes
