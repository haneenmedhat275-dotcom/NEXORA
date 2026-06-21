const evaluateAnswer = async (question, studentAnswer, modelAnswer) => {
  return {
    score: Math.floor(Math.random() * 5) + 5,
    comment: "Good answer! Keep practicing to improve further."
  };
};

module.exports = { evaluateAnswer };