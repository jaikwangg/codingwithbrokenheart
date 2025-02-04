let username;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const fetchOptions = {
    credentials: "include",
    headers: {
      "X-IG-App-ID": "936619743392459",
    },
    method: "GET",
};

/**
 * Fetches paginated Instagram data recursively with retries and rate limiting.
 */
const concatFriendshipsApiResponse = async (list, user_id, count, next_max_id = "", retries = 3) => {
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
      const timeToSleep = random(4000, 7000); // Longer sleep to avoid rate limiting
      console.log(`Sleeping ${timeToSleep}ms to avoid rate limiting...`);
      await sleep(timeToSleep);

      return data.users.concat(
        await concatFriendshipsApiResponse(list, user_id, count, data.next_max_id)
      );
    }

    return data.users || [];
  } catch (error) {
    console.error(`Error fetching ${list}:`, error.message);

    if (retries > 0) {
      const waitTime = random(3000, 8000);
      console.log(`Retrying in ${waitTime}ms... (${retries} retries left)`);
      await sleep(waitTime);
      return concatFriendshipsApiResponse(list, user_id, count, next_max_id, retries - 1);
    }

    return [];
  }
};

/**
 * Fetches followers and following multiple times to detect missing users.
 */
const getMultipleFollowerLists = async (user_id, retries = 5) => {
  let allResults = [];

  for (let i = 0; i < retries; i++) {
    console.log(`Fetching followers... Attempt ${i + 1} of ${retries}`);
    const followers = await getFollowers(user_id);
    const usernames = new Set(followers.map(f => f.username.toLowerCase()));

    console.log(`Fetched ${usernames.size} followers on attempt ${i + 1}`);
    allResults.push(usernames);

    const sleepTime = random(5000, 9000);
    console.log(`Sleeping for ${sleepTime}ms before next fetch...`);
    await sleep(sleepTime);
  }

  return allResults;
};

/**
 * Detects missing followers by comparing multiple fetch results.
 */
const findInconsistentFollowers = (allResults) => {
  const allUsernames = new Map();

  allResults.forEach((userSet) => {
    userSet.forEach((user) => {
      allUsernames.set(user, (allUsernames.get(user) || 0) + 1);
    });
  });

  const missingFollowers = [];
  allUsernames.forEach((count, username) => {
    if (count < allResults.length) {
      missingFollowers.push({ username, timesAppeared: count });
    }
  });

  console.log(`Found ${missingFollowers.length} missing or inconsistent followers`);
  return missingFollowers;
};

const getFollowers = (user_id, count = 30) => {
  return concatFriendshipsApiResponse("followers", user_id, count);
};

const getFollowing = (user_id, count = 30) => {
  return concatFriendshipsApiResponse("following", user_id, count);
};

/**
 * Fetches a user's Instagram ID by username.
 */
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

/**
 * Fetches and compares followers/following, detects missing followers.
 */
const getUserFriendshipStats = async (username) => {
  const user_id = await getUserId(username);

  if (!user_id) {
    throw new Error(`Could not find user with username ${username}`);
  }

  console.log(`Fetching data for user ID: ${user_id} (${username})...`);

  const [followersList, following] = await Promise.all([
    getMultipleFollowerLists(user_id), 
    getFollowing(user_id)
  ]);

  const missingFollowers = findInconsistentFollowers(followersList);

  // Take the latest fetched followers list
  const followers = Array.from(followersList[followersList.length - 1] || []);
  const followingUsernames = following.map((f) => f.username.toLowerCase());

  console.log("-".repeat(30));
  console.log(`Final follower count: ${followers.length}`);
  console.log(`Final following count: ${followingUsernames.length}`);

  const PeopleIDontFollowBack = followers.filter((f) => !followingUsernames.includes(f));
  const PeopleNotFollowingMeBack = followingUsernames.filter((f) => !followers.includes(f));

  console.log("Missing Followers:", missingFollowers);

  return {
    followers,
    followingUsernames,
    PeopleIDontFollowBack,
    PeopleNotFollowingMeBack,
    missingFollowers,
  };
};

// Run and fetch stats
getUserFriendshipStats("worajai_")
  .then((data) => console.log("Friendship stats:", data))
  .catch((err) => console.error("Error:", err.message));
