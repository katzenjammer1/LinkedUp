// src/lib/matchingService.js
import { getUsersForMatching } from "./userService";
import { calculateDistance } from "./locationService";

export const findMatches = async (currentUser, userProfile, location) => {
  try {
    const result = await getUsersForMatching(currentUser.uid, userProfile);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const matches = result.data
      .filter((user) => {
        // Age range filter
        const userAge = user.age || 25;
        const inAgeRange =
          userAge >= userProfile.ageRange?.min &&
          userAge <= userProfile.ageRange?.max;

        // Distance filter (if both users have locations)
        let withinDistance = true;
        if (location && user.location) {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            user.location.latitude,
            user.location.longitude
          );
          withinDistance = distance <= (userProfile.maxDistance || 25);
        }

        return inAgeRange && withinDistance;
      })
      .map((user) => ({
        ...user,
        compatibility: calculateCompatibility(userProfile, user),
      }))
      .sort((a, b) => b.compatibility - a.compatibility);

    return { success: true, data: matches };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const calculateCompatibility = (user1, user2) => {
  let score = 0;

  // Interest overlap
  const interests1 = user1.interests || [];
  const interests2 = user2.interests || [];
  const commonInterests = interests1.filter((interest) =>
    interests2.includes(interest)
  ).length;
  score += commonInterests * 50;

  // Activity overlap
  const activities1 = user1.preferredActivities || [];
  const activities2 = user2.preferredActivities || [];
  const commonActivities = activities1.filter((activity) =>
    activities2.includes(activity)
  ).length;
  score += commonActivities * 40;

  // Available days overlap
  const days1 = user1.availableDays || [];
  const days2 = user2.availableDays || [];
  const commonDays = days1.filter((day) => days2.includes(day)).length;
  score += commonDays * 10;

  let difference = Math.abs(user1.age - user2.age);
  if (difference !== 0){
    score += Math.max(1, 30/difference); 
  }
  else{
    score += 30;
  }


  return score;
};
