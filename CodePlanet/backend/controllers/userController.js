
const User=require('../models/userschema');
const Submission = require('../models/submission_model');
const Problem = require('../models/problems_model');

const get_user=async (req,res)=>{
    try {
        const userId = req.params.id;
        console.log("BACKEDN INSIDER");
       console.log(userId);
        const user = await User.findById(userId).select('-password');
       

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
      
       
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}


const edit_user = async (req, res) => {
    console.log(req);
    const userid = req.params.id;
    const { username, contact } = req.body;

    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = username;
        user.contact = contact;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
};

const get_submissions=async (req,res)=>{
    try {
        const userId = req.params.id;
        // console.log(userId);
        const submissions = await Submission.find({ userid: userId });
       
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;
        const submissionsData = [];
        const countedQuestionIds = new Map();
        for (const submission of submissions) {
            const question = await Problem.findById(submission.problemid);
         
            if (question && submission.verdict === 'Pass' && !countedQuestionIds.has(question._id.toString())) {
                if (question.difficulty === 'easy') {
                    easyCount++;
                } else if (question.difficulty === 'medium') {
                    mediumCount++;
                } else if (question.difficulty === 'hard') {
                    hardCount++;
                }
                countedQuestionIds.set(question._id.toString(), true);
            }
                submissionsData.push({
                    date: submission.createdAt,
                    code:submission.code,
                    problem: question.title,
                    difficulty: question.difficulty,
                    language: submission.language,
                    verdict: submission.verdict
                });

            
        }
        const responseData = {
            submissions: submissionsData,
            questionsSolved: {
                easy: easyCount,
                medium: mediumCount,
                hard: hardCount
            },
           
        };
        // console.log(responseData)

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching user submissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports={
    get_user,edit_user,get_submissions
}