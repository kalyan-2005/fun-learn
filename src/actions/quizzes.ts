import { db } from "@/lib/db";
import getCurrentUser from "./getCurrentUser";

export const getAllQuizzes = async () => {
  const quizzes = await db.quiz.findMany({});
  return quizzes;
};

export const getModulesbyQuizId = async (quizId: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const modules = await db.module.findMany({
    where: {
      quizId: quizId,
    },
    include: {
      submodules: {
        include: {
          score: true,
        },
      },
    },
  });

  modules.map((module) => {
    module.submodules.map((submodule) => {
      submodule.score = submodule.score.filter(
        (score) => score.userId === currentUser.id
      );
    });

    module.submodules.sort((a, b) => a.level - b.level);
  });

  let currentLevel = 1;
  for (let i = 0; i < modules.length; i++) {
    let found = false;
    for (let j = 0; j < modules[i].submodules.length; j++) {
      if (modules[i].submodules[j].score.length > 0) {
        found = true;
        currentLevel = modules[i].submodules[j].level + 1;
        modules[i].submodules[j].isUnlocked = true;
      }
    }
    if (!found) {
      break;
    }
  }

  return { modules, currentLevel };
};

export const getQuestionsByModuleId = async (moduleId: string) => {
  const questions = await db.submodule.findMany({
    where: {
      moduleId: moduleId,
    },
  });
  return questions;
};

export const getQuestionsBySubmoduleId = async (submoduleId: string) => {
  const questions = await db.submodule.findUnique({
    where: {
      id: submoduleId,
    },
  });
  return questions;
};

export const updateHeartsDiamonds = async (
  hearts: number,
  diamonds: number
) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const updatedUser = await db.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      hearts: hearts,
      diamonds: diamonds,
    },
  });

  return updatedUser;
};

export const updateScore = async (submoduleId: string, score: number) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const updatedScore = await db.score.create({
    data: {
      userId: currentUser.id,
      submoduleId: submoduleId,
      score: score,
    },
  });
  return updatedScore;
}

export const leaderboard = async (quizId: string) => {
  const leaderboard = await db.score.findMany({
    where: {
      submodule: {
        quizId: quizId,
      },
    },
    include: {
      user: true,
    },
  });

  let usersWithScore: any = [];

  leaderboard.forEach((score) => {
    const userIndex = usersWithScore.findIndex(
      (user: any) => user.id === score.user.id
    );

    if (userIndex === -1) {
      usersWithScore.push({
        id: score.user.id,
        name: score.user.name,
        username: score.user.username,
        image: score.user.image,
        score: score.score,
      });
    } else {
      usersWithScore[userIndex].score += score.score;
    }
  });

  usersWithScore = usersWithScore.sort((a: any, b: any) => b.score - a.score);

  return usersWithScore;
};

export const getDashboardDetails = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }
  // get total score and total number of levels of current user
  const scores = await db.score.findMany({
    where: {
      userId: currentUser.id,
    }
  });

  // get total score and total number of levels of current user
  let totalScore = 0;
  scores.forEach((x) => {
    totalScore += x.score;
  });
  const totalQuizzes = scores.length||0;
  return {totalScore, totalQuizzes};
}