const fetchQuizData = async () => {
  try {
    setLoading(true);
    setError(null);

    console.log("🔍 Fetching quiz for videoId:", videoId);

    // Try actual API first
    let quizData;
    try {
      quizData = await getQuizBySeriesVideoApi(videoId);
      console.log("🔍 Quiz API Response:", quizData);
    } catch (apiError) {
      console.warn("⚠️ API failed, using mock data");
      // Fallback to mock data
      quizData = getMockQuizData();
    }

    if (!quizData) {
      setError("No quiz data available");
      return;
    }

    if (!quizData.questions || quizData.questions.length === 0) {
      setError("No questions available for this lesson.");
      return;
    }

    setQuizId(quizData.id || 1);

    // Transform API data
    const transformedQuestions = quizData.questions.map((q, index) => ({
      id: q.id || index + 1,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(
        (opt) => opt !== null && opt !== ""
      ),
      correctAnswer: getCorrectAnswerIndex(q.correct_option),
      correctOption: q.correct_option,
    }));

    console.log("🔍 Transformed Questions:", transformedQuestions);
    setQuestions(transformedQuestions);
  } catch (err) {
    console.error("❌ Error fetching quiz:", err);
    setError("Failed to load quiz. Please try again.");
  } finally {
    setLoading(false);
  }
};

// Mock data for testing
const getMockQuizData = () => {
  return {
    id: 1,
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        option_a: "London",
        option_b: "Paris",
        option_c: "Berlin",
        option_d: "Madrid",
        correct_option: "b",
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        option_a: "Earth",
        option_b: "Mars",
        option_c: "Jupiter",
        option_d: "Saturn",
        correct_option: "b",
      },
      {
        id: 3,
        question: "What is 2 + 2?",
        option_a: "3",
        option_b: "4",
        option_c: "5",
        option_d: "6",
        correct_option: "b",
      },
    ],
  };
};
