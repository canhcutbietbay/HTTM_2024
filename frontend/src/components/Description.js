import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Description.css";
import exmjpg from "../assets/header_background.jpg";
import uploadImageToImgBB from "../utils/Image";
import axios from "axios";

const Description = () => {
  const [ingredients, setIngredients] = useState([
    { id: "", name: "", measure: "" },
  ]);
  const [recipe, setRecipe] = useState({
    name: "",
    cuisine: "",
    category: "",
    instructions: "",
    image_url: "",
    video_url: "",
    tags: "",
  });

  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const formRef = useRef();

  const handlePostRecipeClick = () => {
    setIsFormVisible(true);
  };

  useEffect(() => {
    // Fetch categories
    axios
      .get("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
      .then((response) =>
        setCategories(response.data.meals.map((meal) => meal.strCategory))
      )
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch cuisines
    axios
      .get("https://26.216.17.44:3000/api/cuisine")
      .then((response) =>
        setCuisines(
          response.data.map((cuisine) => ({
            id: cuisine.Id,
            name: cuisine.Area,
          }))
        )
      )
      .catch((error) => console.error("Error fetching cuisines:", error));

    // Fetch ingredient options
    axios
      .get("https://26.216.17.44:3000/api/ingredients")
      .then((response) => setIngredientOptions(response.data))
      .catch((error) => console.error("Error fetching ingredients:", error));
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsFormVisible(false);
      }
    };

    if (selectedImage) {
      console.log(selectedImage);
      handleUpload();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...ingredients];

    if (name === "name") {
      const selectedIngredient = ingredientOptions.find(
        (ingredient) => ingredient.Name === value
      );
      if (selectedIngredient) {
        list[index]["id"] = selectedIngredient.Id;
        list[index][name] = value;
      } else {
        list[index]["id"] = "";
        list[index][name] = value;
      }
    } else {
      list[index][name] = value;
    }

    setIngredients(list);
  };

  const filteredIngredients = (input, options) => {
    return options.filter((option) =>
      option.Name.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: "", name: "", measure: "" }]);
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const handleUpload = async () => {
    try {
      const url = await uploadImageToImgBB(selectedImage);
      setImageUrl(url);
      setRecipe({ ...recipe, image_url: url }); // Cập nhật recipe với URL của ảnh
      console.log("URL của ảnh: ", url);
    } catch (error) {
      console.error("Lỗi khi upload: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      name: recipe.name,
      cuisine_id: recipe.cuisine,
      category: recipe.category,
      instruction: recipe.instructions,
      image_url: imageUrl, // Sử dụng URL của ảnh đã upload
      video_url: recipe.video_url ? recipe.video_url : "",
      tags: recipe.tags,
      ingredients: ingredients.map((ingredient) => ({
        Id: ingredient.id,
        measure: ingredient.measure,
      })),
    };
    console.log(postData);
    // Gửi dữ liệu tới server
    await axios
      .post("https://26.216.17.44:3000/api/recipes", postData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Success:", response.data);
        setIsFormVisible(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    window.location.reload();
  };

  return (
    <>
      <Container className="content">
        <Row className="description my-3">
          <Col md={6}>
            <h2>Welcome to WhatEat!</h2>
            <p className="custom-text">
              Discover your next culinary adventure with WhatEat! We're the
              go-to destination for food lovers seeking delicious inspiration.
              Whether you're planning a quick weeknight dinner or a gourmet
              feast, our vast collection of recipes and culinary tips will help
              you create mouthwatering meals that will delight your taste buds.
              From comfort food classics to exotic international dishes, WhatEat
              is your trusted companion in making every meal a memorable
              experience. Join our community of food enthusiasts and turn your
              kitchen into a place of delicious possibilities!
            </p>
            <Button
              className="mb-2"
              id="post-recipe"
              onClick={handlePostRecipeClick}
            >
              Share Recipe
            </Button>
          </Col>
          <Col md={6} className="exmimg">
            <img src={exmjpg} alt="Delicious Food" className="img-fluid" />
          </Col>
        </Row>
      </Container>
      {isFormVisible && (
        <div className="post-modal">
          <Form ref={formRef} className="form-content" onSubmit={handleSubmit}>
            <label className="import">Name</label>
            <input
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleInputChange}
              required
            />

            <label className="import">Cuisine</label>
            <select
              name="cuisine"
              value={recipe.cuisine}
              onChange={handleInputChange}
              required
              className="py-2"
            >
              <option value="">--Select cuisine--</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine.id} value={cuisine.id}>
                  {cuisine.name}
                </option>
              ))}
            </select>

            <label className="import">Category</label>
            <select
              name="category"
              value={recipe.category}
              onChange={handleInputChange}
              required
              className="py-2"
            >
              <option value="">--Select category--</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="import">Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-container">
                <input
                  type="text"
                  name="name"
                  placeholder="Ingredient"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(e, index)}
                  required
                  className="ingredient-input"
                  list={`ingredient-options-${index}`}
                />
                <datalist id={`ingredient-options-${index}`}>
                  {filteredIngredients(ingredient.name, ingredientOptions).map(
                    (option, i) => (
                      <option key={i} value={option.Name} />
                    )
                  )}
                </datalist>
                <input
                  type="text"
                  name="measure"
                  placeholder="Measure"
                  value={ingredient.measure}
                  onChange={(e) => handleIngredientChange(e, index)}
                  required
                  className="ingredient-input"
                />
                {index === ingredients.length - 1 && (
                  <button type="button" onClick={handleAddIngredient}>
                    Add ingredient
                  </button>
                )}
              </div>
            ))}

            <label className="import">Instructions</label>
            <textarea
              name="instructions"
              value={recipe.instructions}
              onChange={handleInputChange}
              required
            ></textarea>

            <label className="import">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />

            <label className="import">Video URL (Youtube link)</label>
            <input
              type="url"
              name="video_url"
              value={recipe.video_url}
              onChange={handleInputChange}
              required
            />

            <label className="import">Tags</label>
            <input
              type="text"
              name="tags"
              value={recipe.tags}
              onChange={handleInputChange}
              required
            />
            {selectedImage && (
              <div className="image-preview">
                <h4>Uploaded Image Preview:</h4>
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: "25%" }}
                />
              </div>
            )}
            <button type="submit" className="mt-2">
              Submit
            </button>
          </Form>
        </div>
      )}
    </>
  );
};
export default Description;
