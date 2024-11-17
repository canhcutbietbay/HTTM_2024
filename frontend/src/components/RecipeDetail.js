import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RecipeDetail.css";
import { getAuthHeader } from "../utils/Jwt";

const RecipeDetail = ({ recipe, onClose }) => {
  const [ingredients, setIngredients] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch danh sách bình luận khi component được mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://26.216.17.44:3000/api/recipes/${recipe.Id}`
        );
        const data = response.data;
        setIngredients(JSON.parse(data[0].ingredients));
        if (data[0].comment.length) setComments(JSON.parse(data[0].comment));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [recipe.Id]); // Đảm bảo chạy lại khi recipe.Id thay đổi

  // Xử lý sự kiện gửi bình luận mới
  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        `http://26.216.17.44:3000/api/comment`,
        {
          recipe_id: recipe.Id,
          text: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      setComments([...comments, data]); // Thêm bình luận mới vào danh sách
      setNewComment(""); // Reset textarea
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="recipe-detail">
      <div className="recipe-modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{recipe.Name}</h2>
        <img src={recipe.Image_url} alt={recipe.Name} />
        <p>
          <i>
            <b>Area: </b>
            {recipe.Area}
          </i>
          <br />
          <i>
            <b>Category: </b>
            {recipe.Category}
          </i>
          <br />
          <i>
            <b>Tags: </b>
            {recipe.Tags.split(",").join(" #")}
          </i>
        </p>
        <b>
          <i>Ingredients:</i>
        </b>
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.Id}>
              {ingredient.Name}: {ingredient.Measure}
            </li>
          ))}
        </ul>
        <b>
          <i>Instructions:</i>
        </b>
        <p>{recipe.Instruction}</p>
        {typeof recipe.Video_url != "undefined" && (
          <p>
            <b>
              <i>Youtube video: </i>
            </b>
            <a href={recipe.Video_url} target="_blank">
              <i className="fab fa-youtube"></i> How to cook {recipe.Name}
            </a>
          </p>
        )}
        <h4>
          Comments (
          <span id="commentCount">{comments ? comments.length : 0}</span>)
        </h4>
        <hr />
        <div id="commentsList">
          {comments &&
            comments.map((comment) => (
              <div key={comment.Id} className="comment">
                <p>
                  <strong>
                    <em>{new Date(comment.Date).toLocaleString()}</em>
                  </strong>
                </p>
                <p>{comment.Text}</p>
              </div>
            ))}
        </div>
        <div className="comment-input">
          <textarea
            id="commentText"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button id="submitComment" onClick={handleCommentSubmit}>
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
