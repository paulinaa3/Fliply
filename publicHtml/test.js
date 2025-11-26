var deckName='Russian Folklore'
       var array
       
       var title=document.getElementById('heading')
       title.innerText='Test for ' + deckName + " (10 Questions)"

       // Quickstart: https://platform.openai.com/docs/quickstart


       import OpenAI from "https://esm.run/openai";


       async function sendRequest() {
           const userText = `
           Generate 10 question answer pairs in comma separated format: q1,ans1,q2,ans2,...,q10,ans10 using given flashcards
            Keep questions and answers short and only about the information given and make sure no commas inside answer
           (Flipcard 1 Front: Baba Yaga Back: Witch-like forest spirit who lives in a hut on chicken legs; may help or harm travelers.
            Flipcard 2 Front: Koschei the Deathless Back: Evil sorcerer who hides his soul inside nested objects, making him nearly impossible to kill. 
            Flipcard 3 Front: Firebird Back: Magical glowing bird whose feathers bring fortune but also danger; central to many heroic quests. 
            Flipcard 4 Front: Vasilisa the Beautiful Back: Clever heroine who survives Baba Yaga’s trials with help from a magical doll given by her mother. 
            Flipcard 5 Front: Leshy Back: Forest guardian who leads travelers astray or protects the woods depending on his mood
            Flipcard 6 Front: Morozko Back: Frost spirit who rewards kindness and punishes cruelty. 
            Flipcard 7 Front: Domovoi Back: Household guardian spirit that protects the home but causes mischief when offended. 
            Flipcard 8 Front: Zmey Gorynych Back: Three headed dragon often battled by heroes like Dobrynya Nikitich. 
            Flipcard 9 Front: Rusalka Back: Water spirit sometimes helpful sometimes dangerous associated with rivers and lakes. 
            Flipcard 10 Front: Alkonost Back: Magical bird with a womans face whose voice brings bliss or forgetfulness),
            i want you to generate 10 questions and answers in comma seperated format like but don't literally write q1 and ans1 : q1,ans1,q2,ans2,q3,ans3,q4,ans4..`
           var output = ""


           // Create client using your API key (local only!)
           const client = new OpenAI({
               apiKey: "YourKeyHere"

               // You should never expose API keys, so this is necessary to paste the key into HTML like this
               // We will hide it in the back end and access it through a post call
               dangerouslyAllowBrowser: true
           });


           // Just a placeholder while waiting for the response


           try {
               const completion = await client.chat.completions.create({
                   // This is the cheapest model. If it is terrible, we can also use "gpt-5-mini", which is still cheap,
                   // or go all out and use "gpt-5.1". We would have to go crazy testing to even spend $20 on this project
                   model: "gpt-5-nano",
                   messages: [
                       // The "system" role is used for instructions about how the LLM should work,
                       // and is used behind the scenes without displaying its response
                       // "developer" is another role we might want to use if we need structured responses
                       // "user" is appropriate for most basic conversations
                       // "assistant" can be used for ongoing conversations, which we probably don't need it for this project,
                       //      but it is a relatively new role that I haven't used before.
                       { role: "user", content: userText }
                   ]
               });


               output= completion.choices[0].message.content;
               var result = document.getElementById("showAI")
               result.innerText=output.split(",")

           } catch (err) {
               output = "Error: " + err;
           }
       

       array=output.split(',')
       //var divs = document.getElementsByTagName('div')
       var divs=document.getElementsByClassName("Question")
       for(var i=0;i<divs.length;i++){
          divs[i].innerText=array[i*2]
       }

       }

       function displayAnswer(qNumber) { 
          var divAns = document.getElementById(qNumber)
          divAns.innerText=array[qNumber]
        }

        function createQuestions(n) {
            var body = document.getElementsByTagName('body')[0]
            var idTracker=1
            var qTracker=1
            for (var i=0;i<n;i++){
                var divQ=  document.createElement('div')
                divQ.innerText = "Q"+qTracker
                qTracker+=1
                divQ.setAttribute('class', "Question")
                

                var divAns=  document.createElement('div')
                divAns.innerText = "Show Answer"
                divAns.setAttribute('id', idTracker)
                divAns.setAttribute('class', "Answer")
                divAns.setAttribute('onclick', "displayAnswer("+idTracker+")")
                //onclick="displayAnswer(3)
                idTracker+=2

                body.appendChild(divQ)
                body.appendChild(divAns)
            }
            
        }


       window.sendRequest = sendRequest;
       window.displayAnswer = displayAnswer;
       window.createQuestions = createQuestions;