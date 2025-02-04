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