
export async function POST(req: Request) {
    const { course } = await req.json();

}

const course = [
    {
        moduleId: "1",
        moduleName: "Module 1",
        submodules: [
            {
                level: 1,
                type: "LECTURE",
                questions: {
                    content: "overall explanation of the topic(module)",    // for displaying students
                    explanation: "brief explanation of the topic(module)"   // read by teacher
                }
            },
            {
                level: 2,
                type: "QUIZ",
                questions: [
                    {
                        question: "question with max of 15 words",
                        options: ["option 1 with max length of 15 words", "option 2 with max length of 15 words", "precisely 4 options"],
                        answer: "1 for 1st option or n for nth option which is correct"
                    },
                    {
                        question: "question with max of 15 words",
                        options: ["option 1 with max length of 15 words", "option 2 with max length of 15 words", "precisely 4 options"],
                        answer: "1 for 1st option or n for nth option which is correct"
                    },
                ]
            }
        ]
    }
]