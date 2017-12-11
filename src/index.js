console.log('THIS IS A TEST TO SEE IF UPLOAD WORKED');
let reindeers = {
  "dasher" : {
    "personalityTrait": "loves to go fast",
    "skill": "sewing"
  },

  "dancer": {
    "personalityTrait": "is completely extroverted",
    "skill": "does all kinds of dance"
  },

  "prancer": {
    "personalityTrait": "is a bit vain, though affectionate",
    "skill": "good at prancing"
  },

  "vixen": {
    "personalityTrait": "is slightly tricky",
    "skill": "good at magic"
  },

  "comet": {
    "personalityTrait": "is handsome and easy-going",
    "skill": "good with kids"
  },

  "cupid": {
    "personalityTrait": "is affectionate",
    "skill": "brings people together"
  },

  "donner": {
    "personalityTrait": "is loud",
    "skill": "electrifies others"
  },

  "blitzen": {
    "personalityTrait": "is fast as a bolt",
    "skill": "good at singing"
  },

  "rudolph": {
    "personalityTrait": "is a little down on himself",
    "skill": "has a nose that glows"
  },

  "olive": {
    "personalityTrait": "admits when she's wrong",
    "skill": "is good at hide-and-go-seek"
  },
};


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
  getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here

    if (intentName === "ReindeerIntent") {
      handleReindeerResponse(intent, session, callback);
    }
    else if (intentName === "AMAZON.YesIntent") {
      handleYesResponse(intent, session, callback);
    }
    else if (intentName === "AMAZON.NoIntent") {
      handleNoResponse(intent, session, callback);
    }
    else if (intentName === "AMAZON.HelpIntent") {
      handleGetHelpRequest(intent, session, callback);
    }
    else if (intentName === "AMAZON.StopIntent") {
      handleFinishSessionRequest(intent, session, callback);
    }
    else if (intentName === "AMAZON.CancelIntent") {
      handleFinishSessionRequest(intent, session, callback);
    }
    else {
      throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
  const speechOutput = "Welcome to Reindeer Facts! I can tell you about all the famous reindeer: " + "Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, Rudolph, and Olive." + "I can only give facts about one at a time. Which reindeer are you interested in?";

  const repromptText = "Which reindeer are you interested in? You can find out about Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, Rudolph, and Olive.";

  let header = "Reindeer Facts";

  var shouldEndSession = false;

  var sessionAttributes = {
    "speechOutput": speechOutput,
    "repromptText": repromptText
  };

  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession));

} // end getWelcomeResponse

function handleReindeerResponse(intent, session, callback) {
  let reindeer = intent.slots.Reindeer.value.toLowerCase();

  let speechOutput;
  let repromptText;
  let header;

  if (!reindeers[reindeer]) {
    speechOutput = "That reindeer isn't very famous. Try asking about another like Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, Rudolph, and Olive.";
    repromptText = "Try asking about another reindeer.";
    header = "Not Famous Enough";
  }
  else {
    let personalityTrait = reindeers[reindeer].personalityTrait;
    let skill = reindeers[reindeer].skill;
    speechOutput = `${capitalizeFirst(reindeer)} ${personalityTrait} and ${skill}. Do you want to hear about more reindeer?`;
    repromptText = 'Do you want to hear about more reindeer?';
    header = capitalizeFirst(reindeer);
  }


  let shouldEndSession = false;

  callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession));
} // end handleReindeerResponse

function handleYesResponse(intent, session, callback) {
  let speechOutput = "Great! Which reindeer do you want to know about? I know about Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, Rudolph, and Olive.";
  let repromptText = speechOutput;
  let shouldEndSession = false;

  callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleNoResponse(intent, session, callback) {
  handleFinishSessionRequest(intent, session, callback);

  callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
  }

  let speechOutput = "I can tell you facts about all the famous reindeer: " + "Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen, Rudolph, and Olive." + "Which reindeer are you interested in? Remember, I can only give facts about one reindeer at a time.";
  let repromptText = speechOutput;
  let shouldEndSession = false;

  callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
} // end handleGetHelpRequest

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thank you for using Reindeer Facts", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
