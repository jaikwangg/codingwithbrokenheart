let username;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const timeToSleep = random(3000, 5000); // 3-5 seconds
await sleep(timeToSleep);

const fetchOptions = {
    credentials: "include",
    headers: {
      "X-IG-App-ID": "936619743392459",
    },
    method: "GET",
  };

const concatFriendshipsApiResponse = async (list, user_id, count, next_max_id = "") => {
  let url = `https://www.instagram.com/api/v1/friendships/${user_id}/${list}/?count=${count}`;
  if (next_max_id) {
    url += `&max_id=${next_max_id}`;
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    
    if (data.users && data.users.length > 0) {
      console.log(`Loaded ${data.users.length} ${list}.`);
    }

    if (data.next_max_id) {
      const timeToSleep = random(2000, 4000);
      console.log(`Sleeping ${timeToSleep}ms to avoid rate limiting...`);
      await sleep(timeToSleep);

      return data.users.concat(
        await concatFriendshipsApiResponse(list, user_id, count, data.next_max_id)
      );
    }

    return data.users || [];
  } catch (error) {
    console.error(`Error fetching ${list}:`, error.message);
    return [];
  }
};

const getFollowers = (user_id, count = 50) => {
  return concatFriendshipsApiResponse("followers", user_id, count);
};

const getFollowing = (user_id, count = 50) => {
  return concatFriendshipsApiResponse("following", user_id, count);
};


const getUserId = async (username) => {
  const lower = username.toLowerCase();
  const url = `https://www.instagram.com/api/v1/web/search/topsearch/?context=blended&query=${lower}&include_reel=false`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const result = data.users?.find((result) => result.user.username.toLowerCase() === lower);
    
    return result?.user?.pk || null;
  } catch (error) {
    console.error(`Error fetching user ID:`, error.message);
    return null;
  }
};


const getUserFriendshipStats = async (username) => {
  const user_id = await getUserId(username);

  if (!user_id) {
    throw new Error(`Could not find user with username ${username}`);
  }

  console.log(`Fetching data for user ID: ${user_id} (${username})...`);

  const [followers, following] = await Promise.all([getFollowers(user_id), getFollowing(user_id)]);

  const followersUsernames = followers.map((f) => f.username.toLowerCase());
  const followingUsernames = following.map((f) => f.username.toLowerCase());

  const followerSet = new Set(followersUsernames);
  const followingSet = new Set(followingUsernames);

// const followersUsernames = [...new Set(followers.map(f => f.username.toLowerCase()))];
// const followingUsernames = [...new Set(following.map(f => f.username.toLowerCase()))];

  console.log("-".repeat(50));
  console.log(`Fetched ${followerSet.size} followers and ${followingSet.size} following.`);
  console.log("Checking for mismatches...");

  const PeopleIDontFollowBack = followersUsernames.filter((f) => !followingSet.has(f));
  const PeopleNotFollowingMeBack = followingUsernames.filter((f) => !followerSet.has(f));

  const checkDataIntegrity = (data, listType) => {
    console.log(`Checking ${listType}: Received ${data.length} users`);
    const uniqueUsers = new Set(data.map(user => user.username.toLowerCase()));
    console.log(`Unique ${listType} count: ${uniqueUsers.size}`);
    return uniqueUsers.size;
  };
  
  const followersCount = checkDataIntegrity(followers, "followers");
  const followingCount = checkDataIntegrity(following, "following");
  
  console.log(`Final follower count: ${followersCount}`);
  console.log(`Final following count: ${followingCount}`);

  const saveDataToFile = (username, data) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); 
    const filename = `${username}_${timestamp}.txt`;
  
    const content = `
    Username: ${username}
    Date: ${new Date().toLocaleString()}
    ----------------------------------------
    Followers (${data.followersUsernames.length}):
    ${data.followersUsernames.join("\n")}
  
    Following (${data.followingUsernames.length}):
    ${data.followingUsernames.join("\n")}
  
    People I Don't Follow Back (${data.PeopleIDontFollowBack.length}):
    ${data.PeopleIDontFollowBack.join("\n")}
  
    People Not Following Me Back (${data.PeopleNotFollowingMeBack.length}):
    ${data.PeopleNotFollowingMeBack.join("\n")}
    `;
  
    // Create a Blob and download file
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    console.log(`✅ Data saved as: ${filename}`);
  };

  const result = {
    followersUsernames,
    followingUsernames,
    PeopleIDontFollowBack,
    PeopleNotFollowingMeBack,
  };

  saveDataToFile(username, result);
  return result;
};

getUserFriendshipStats("worajai_")
  .then((data) => console.log("Friendship stats:", data))
  .catch((err) => console.error("Error:", err.message));