import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Navbar";
import Description from "./Description";
import RecipeList from "./RecipeList";
import Loading from "../utils/Loading";
import { on } from "process";

function Home() {
  const [userImage, setUserImage] = useState(
    localStorage.getItem("picture") || "./user.jpg"
  );
  const [ready, setReady] = useState(false);
  const [searchChange, setSearchChange] = useState(false);
  const [loop, setLoop] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [recipesCategory, setRecipesCategory] = useState({
    new: [],
    most: [],
    maybe: [],
  });

  const [recipesProfile, setRecipesProfile] = useState({
    like: [],
    save: [],
    post: [],
    comment: [],
  });

  const [recipesInfo, setRecipesInfo] = useState({
    like: [],
    save: [],
    post: [],
    comment: [],
  });

  const handleProfile = async () => {
    try {
      const updatedProfile = { ...recipesProfile };
      for (let key in recipesInfo) {
        if (recipesInfo[key]) {
          const requests = recipesInfo[key].map((recipe) =>
            axios.get(
              `https://26.216.17.44:3000/api/recipes/${recipe.Id_recipe}`
            )
          );
          const responses = await Promise.all(requests);
          updatedProfile[key] = responses.map((response) => response.data[0]);
        }
      }
      setRecipesProfile(updatedProfile);
    } catch (error) {
      console.error("Error fetching recipe by id:", error);
    }
  };

  const fetchSmart = async () => {
    console.log("fetching smart");
    try {
      const response = await axios.get("https://26.216.17.44:3000/api/smart", {
        withCredentials: true,
      });
      const allData = await axios.get("https://26.216.17.44:3000/api/recipes");
      const smartData = await response.data;
      setRecipes(
        allData.data.sort((a, b) => a.FavoriteCount - b.FavoriteCount)
      );
      handleRecipesCategory(smartData);
    } catch (error) {
      console.error("Error fetching smart recipes:", error);
    }
  };

  const handleRecipesCategory = (data) => {
    let sortedRecipes = [...data];
    sortedRecipes.sort((a, b) => b.FavoriteCount - a.FavoriteCount);

    let most = [];
    let i = 0;
    for (
      let count = 0;
      count < (sortedRecipes.length < 10 ? sortedRecipes.length : 10);
      count++
    ) {
      if (!(sortedRecipes[count].FavoriteCount > 0)) {
        most = sortedRecipes.slice(0, count);
        i = count;
        break;
      }
    }
    const subrecipes = sortedRecipes.slice(i + 1);

    setRecipesCategory({
      most,
      maybe: subrecipes,
      new: recipes,
    });
  };

  const handleSearch = async (term) => {
    try {
      recipesCategory.new = sortByKeyword(recipesCategory.new, term);
      recipesCategory.most = sortByKeyword(recipesCategory.most, term);
      recipesCategory.maybe = sortByKeyword(recipesCategory.maybe, term);
      console.log("searching ", term);
      console.log(recipesCategory.new);
      setSearchChange(!searchChange);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "https://26.216.17.44:3000/api/profile",
        {
          withCredentials: true,
        }
      );
      const data = await response.data;
      setRecipesInfo({
        like: JSON.parse(data[0].favorited),
        save: JSON.parse(data[0].saved),
        post: JSON.parse(data[0].share_recipe),
        comment: JSON.parse(data[0].comment_recipe),
      });
      handleProfile();
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const onLoad = () => {
    fetchProfile();
    fetchSmart();
  };
  useEffect(() => {
    if (recipesCategory.new.length > 0) {
      setReady(true);
      console.log(recipesCategory);
    } else {
      if (loop != 0)
        setTimeout(() => {
          setLoop(loop + 1);
          console.log(loop);
        }, 500);
      else {
        setLoop(1);
      }
    }
    return () => {
      onLoad();
    };
  }, [loop]);

  const load = () => {
    return (
      <>
        <Nav
          userImage={userImage}
          onBrandClick={onLoad}
          onSearch={handleSearch}
          searchChange={searchChange}
        />
        <Description />
        <RecipeList
          recipesProfile={recipesProfile}
          recipes={recipesCategory}
          isHome={true}
          searchChange={searchChange}
        />
      </>
    );
  };

  function sortByKeyword(array, keyword) {
    return array.sort((a, b) => {
      const aContainsKeyword = a.Name.toLowerCase().includes(
        keyword.toLowerCase()
      );
      const bContainsKeyword = b.Name.toLowerCase().includes(
        keyword.toLowerCase()
      );

      if (aContainsKeyword && !bContainsKeyword) {
        console.log(-1);
        return -1; // a đứng trước b
      }
      if (!aContainsKeyword && bContainsKeyword) {
        console.log(1);
        return 1; // b đứng trước a
      }
      return 0; // giữ nguyên thứ tự nếu cả hai đều chứa hoặc không chứa từ khóa
    });
  }

  return <>{ready ? load() : <Loading />}</>;
}

export default Home;
