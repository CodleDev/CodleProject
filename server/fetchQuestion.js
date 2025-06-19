async function fetchLeetCodeQuestion() {
    const alfa = new Alfa(); // You can pass in a config object if needed
  
    try
    {
      const { title, titleSlug, content, date } = await alfa.getQuestion({ date: new Date() });
      console.log({ title, titleSlug, content, date });
      return { title, titleSlug, content, date };
    } 
    catch (error)
    {
      console.error('Error fetching LeetCode question:', error);
      throw error;
    }
}
  
module.exports = fetchLeetCodeQuestion;