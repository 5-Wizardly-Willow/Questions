# Questions

## CLIENT USAGE NOTES
1. View questions
1. Search questions
1. Asking a question
1. Answering a question

Questions and Answers should be displayed in expanding and collapsing accordian.
- Default shows
   - up to 4 questions with
      - up to 2 answers each.



# Notes


/*
GET /qa/questions

product_id	integer	Specifies the product for which to retrieve questions.
page	integer	Selects the page of results to return. Default 1.
count	integer	Specifies how many results per page to return. Default 5

POST /qa/questions

body	text	Text of question being asked
name	text	Username for question asker
email	text	Email address for question asker
product_id	integer	Required

PUT /qa/questions/:question_id/helpful

PUT /qa/questions/:question_id/report
*/



/*
GET /qa/questions/:question_id/answers

question_id	integer	Required ID of the question for wich answers are needed
page	integer	Selects the page of results to return. Default 1.
count	integer	Specifies how many results per page to return. Default 5.

POST /qa/questions/:question_id/answers

question_id	integer	Required ID of the question to post the answer for
body	text	Text of question being asked
name	text	Username for question asker
email	text	Email address for question asker
photos	[text]	An array of urls corresponding to images to display

PUT /qa/answers/:answer_id/helpful

PUT /qa/answers/:answer_id/report
*/

GET questions

response:

{
    "question_id": 75643,
    "question_body": "What fabric is the top made of?",
    "question_date": "2018-02-12T00:00:00.000Z",
    "asker_name": "mrmrs",
    "question_helpfulness": 6,
    "reported": false,
    "answers": {
        "718462": {
            "id": 718462,
            "body": "Something pretty soft but I can't be sure",
            "date": "2018-02-12T00:00:00.000Z",
            "answerer_name": "mrmrs",
            "helpfulness": 0,
            "photos": []
        },
        "718473": {
            "id": 718473,
            "body": "Its the best! Seriously magic fabric",
            "date": "2018-03-12T00:00:00.000Z",
            "answerer_name": "mrmrs",
            "helpfulness": 1,
            "photos": []
        },
        "718478": {
            "id": 718478,
            "body": "Supposedly suede, but I think its synthetic",
            "date": "2018-03-12T00:00:00.000Z",
            "answerer_name": "mrmrs",
            "helpfulness": 2,
            "photos": []
        },
        "718502": {
            "id": 718502,
            "body": "Suede",
            "date": "2018-03-12T00:00:00.000Z",
            "answerer_name": "mrmrs",
            "helpfulness": 9,
            "photos": []
        }
    }
},




GET answers to question
response:

{
    "question": "153654",
    "page": 1,
    "count": 5,
    "results": [
        {
            "answer_id": 1444517,
            "body": "It fits this one but he's pretty small for a dino",
            "date": "2021-03-16T00:00:00.000Z",
            "answerer_name": "Barney",
            "helpfulness": 1,
            "photos": [
                {
                    "id": 1260706,
                    "url": "https://en.wikipedia.org/wiki/File:Dino_from_%22The_Flintstones%22.gif#/media/File:Dino_from_\"The_Flintstones\".gif"
                }
            ]
        }
    ]
}