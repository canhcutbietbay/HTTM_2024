import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./Navbar";
import Description from "./Description";
import RecipeList from "./RecipeList";
import Loading from "../utils/Loading";

function Home() {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(
    localStorage.getItem("picture") || "./user.jpg"
  );
  const [ready, setReady] = useState(false);
  const [searchChange, setSearchChange] = useState(false);
  const [smartLoaded, setSmartLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [recipesCategory, setRecipesCategory] = useState(null);
  const [recipesInfo, setRecipesInfo] = useState(null);
  //
  const fetchSmart = async () => {
    // console.log("fetching smart");
    try {
      const response = await axios.get("https://26.216.17.44:3000/api/smart", {
        withCredentials: true,
      });
      const allData = await axios.get("https://26.216.17.44:3000/api/recipes");
      const smartData = await response.data;
      smartData.sort((a, b) => b.FavoriteCount - a.FavoriteCount);
      let most = [];
      let i = 0;
      for (
        let count = 0;
        count < (smartData.length < 10 ? smartData.length : 10);
        count++
      ) {
        if (!(smartData[count].FavoriteCount > 0)) {
          most = smartData.slice(0, count);
          i = count;
          break;
        }
      }
      const subrecipes = smartData.slice(i + 1);
      setRecipesCategory({
        most,
        maybe: subrecipes,
        new: allData.data.sort((a, b) => a.FavoriteCount - b.FavoriteCount),
      });
      setSmartLoaded(true);
    } catch (error) {
      console.error("Error fetching smart recipes:", error);
    }
  };

  const fetchProfile = async () => {
    // console.log("fetching profile");
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
      setProfileLoaded(true);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("userEmail")) navigate("/login");
    else {
      fetchSmart();
      fetchProfile();
    }
  }, []);
  useEffect(() => {
    if (profileLoaded && smartLoaded) {
      setReady(true);
      console.log(recipesInfo);
    }
    // console.log("check:", profileLoaded, smartLoaded);
  }, [recipesInfo, recipesCategory]);

  const handleSearch = async (term) => {
    try {
      recipesCategory.new = sortByKeyword(recipesCategory.new, term);
      recipesCategory.most = sortByKeyword(recipesCategory.most, term);
      recipesCategory.maybe = sortByKeyword(recipesCategory.maybe, term);
      console.log("searching:", term);
      setSearchChange(!searchChange);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };
  //=>
  function sortByKeyword(array, keyword) {
    return array.sort((a, b) => {
      const aContainsKeyword = a.Name.toLowerCase().includes(
        keyword.toLowerCase()
      );
      const bContainsKeyword = b.Name.toLowerCase().includes(
        keyword.toLowerCase()
      );

      if (aContainsKeyword && !bContainsKeyword) {
        return -1; // a đứng trước b
      }
      if (!aContainsKeyword && bContainsKeyword) {
        return 1; // b đứng trước a
      }
      return 0; // giữ nguyên thứ tự nếu cả hai đều chứa hoặc không chứa từ khóa
    });
  }
  //LOAD
  const load = () => {
    return (
      <>
        <Nav
          userImage={userImage}
          onSearch={handleSearch}
          searchChange={searchChange}
        />
        <Description />
        <RecipeList
          recipesProfile={recipesInfo}
          recipes={recipesCategory}
          isHome={true}
          searchChange={searchChange}
        />
      </>
    );
  };

  return <>{ready ? load() : <Loading />}</>;
}

export default Home;
