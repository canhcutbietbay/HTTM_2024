import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import "../styles/RecipeDetail.css";

const RecipeDetail = ({ recipe, selfComments, onAdd, onClose }) => {
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
        if (data[0].Comment?.length) setComments(JSON.parse(data[0].Comment));
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
        `https://26.216.17.44:3000/api/comment`,
        {
          recipe_id: recipe.Id,
          text: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const id_comment = await response.data[0];
      const recentComment = {
        Id: id_comment,
        Id_recipe: recipe.Id,
        Date: new Date(),
        Text: newComment,
      };
      setComments([...comments, recentComment]); // Thêm bình luận mới vào danh sách
      selfComments.push(id_comment);
      onAdd(id_comment);
      setNewComment(""); // Reset textarea
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    // Xử lý khi người dùng xóa bình luận
    Swal.fire({
      title: "Do you actually want to delete this comment?",
      text: "This action cannot be undo!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setComments(comments.filter((comment) => comment.Id !== commentId));
          selfComments.filter((comment) => comment !== commentId);
          await axios.delete("https://26.216.17.44:3000/api/comment", {
            params: { comment_id: commentId },
            withCredentials: true,
          });
          console.log("Delete comment successfully");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      }
    });
  };

  return (
    <div className="recipe-detail">
      <div className="recipe-modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{recipe.Name}</h2>
        <p hidden={recipe.DisplayName ? false : true}>
          <i>by </i>
          <b>{recipe.DisplayName}</b>
        </p>
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
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.Id} className="comment">
                <div className="comment-actions">
                  <i>
                    <b>{comment.Email}</b> -
                    {new Date(comment.Date).toLocaleString()}-
                  </i>
                  {selfComments.includes(comment.Id) ? (
                    <button
                      className={`action-btn delete-btn`}
                      onClick={() => handleDelete(comment.Id)} // Sử dụng handleDelete trực tiếp
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <p>{comment.Text}</p>
              </div>
            ))
          ) : (
            <></>
          )}
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
