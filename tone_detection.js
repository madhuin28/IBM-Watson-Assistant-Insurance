

'use strict';
/* eslint-env es6 */

var Promise = require('bluebird');
var dc = '';

/**
 * Thresholds for identifying meaningful tones returned by the Watson Tone
 * Analyzer. Current values are based on the recommendations made by the Watson
 * Tone Analyzer at
 * https://www.ibm.com/watson/developercloud/doc/tone-analyzer/understanding-tone.shtml
 * These thresholds can be adjusted to client/domain requirements.
 */
var PRIMARY_EMOTION_SCORE_THRESHOLD = 0.5;


/**
 * Labels for the tone categories returned by the Watson Tone Analyzer
 */
var EMOTION_TONE_LABEL = 'emotion_tone';


/**
 * Public functions for this module
 */
module.exports = {
  updateUserTone: updateUserTone,
  invokeToneAsync: invokeToneAsync,
  initUser: initUser
};

/**
 * invokeToneAsync is an asynchronous function that calls the Tone Analyzer
 * service and returns a Promise
 *
 * @param {Json}
 *                conversationPayload json object returned by the Watson
 *                Conversation Service
 * @param {Object}
 *                toneAnalyzer an instance of the Watson Tone Analyzer service
 * @returns {Promise} a Promise for the result of calling the toneAnalyzer with
 *          the conversationPayload (which contains the user's input text)
 */
function invokeToneAsync(conversationPayload, toneAnalyzer) {
	
  console.log('Payload : %d', conversationPayload);
  
  //console.log(conversationPayload);
  if (!conversationPayload.input || !conversationPayload.input.text || conversationPayload.input.text.trim() == '')
    conversationPayload.input.text = '<empty>';
  if (conversationPayload.input.text != '<empty>')
    dc +=conversationPayload.input.text;
  else 
    dc = dc;
  //console.log(dc);

  if (!conversationPayload.context.user) {
    conversationPayload.context.user = initUser();
  }
  
  if (!conversationPayload.context) {
    conversationPayload.context = {};
  }

var user = conversationPayload.context.user;

 
var utterances = [
        {
	   text: conversationPayload.input.text,
	   user: "customer"
	}
  ]
  var toneChatParams = {
      utterances: utterances
      };
toneAnalyzer.toneChat(toneChatParams, function (error, utteranceAnalyses) {
     if(error){
        console.log(error);
     }
    
     else {
		//console.log(JSON.stringify(utteranceAnalyses, null, 2));
		var obj=utteranceAnalyses;
		var len=obj.utterances_tone[0].tones.length;
		//console.log(len);
		var k=0;
		var max=0;
		if(len){
			for(var i=0;i<len;i++){
				if(max < obj.utterances_tone[0].tones[i].score){
					k=i;
					max=obj.utterances_tone[0].tones[i].score;
				}
			}
			var customer_toneScore = obj.utterances_tone[0].tones[k].score;
			var customer_tonename = obj.utterances_tone[0].tones[k].tone_name;
			
		    }
                    
                    if (typeof customer_tonename === "undefined")
                        customer_tonename = 'neutral';
                    if(typeof customer_toneScore === "undefined")
                        customer_toneScore = 0.0;


                    user.tone.cus_emotion.Overall_Conversation = customer_tonename;
		    user.tone.cus_emotion.Overall_toneScore = customer_toneScore;
		   
             }
         
});  

var toneParams = {
  tone_input: { 'text': dc },
  content_type: 'application/json'
};

toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
  if (error) {
    console.log(error);
  } else { 
    //console.log(JSON.stringify(toneAnalysis, null, 2));
		var obj=toneAnalysis;
		var len=obj.document_tone.tone_categories[0].tones.length;
		
		var k=0;
		var max=0;
		if(len){
			for(var i=0;i<len;i++){
				if(max < obj.document_tone.tone_categories[0].tones[i].score){
					k=i;
					max=obj.document_tone.tone_categories[0].tones[i].score;
				}
			}
			var customer_toneScore = obj.document_tone.tone_categories[0].tones[k].score;
			var customer_tonename = obj.document_tone.tone_categories[0].tones[k].tone_name;
			
		    }
                   

                    user.tone.gen_emotion.Overall_Conversation = customer_tonename;
		    user.tone.gen_emotion.Overall_toneScore = customer_toneScore;
		   
             }
         
});  




  var utterances = [
        {
	   text: dc,
	   user: "customer"
	}
  ]
  var toneChatParams = {
      utterances: utterances
      };
toneAnalyzer.toneChat(toneChatParams, function (error, utteranceAnalyses) {
     if(error){
        console.log(error);
     }
    
     else {
		//console.log(JSON.stringify(utteranceAnalyses, null, 2));
		var obj=utteranceAnalyses;
		var len=obj.utterances_tone[0].tones.length;
		//console.log(len);
		var k=0;
		var max=0;
		if(len){
			for(var i=0;i<len;i++){
				if(max < obj.utterances_tone[0].tones[i].score){
					k=i;
					max=obj.utterances_tone[0].tones[i].score;
				}
			}
			var customer_toneScore = obj.utterances_tone[0].tones[k].score;
			var customer_tonename = obj.utterances_tone[0].tones[k].tone_name;
			
		    }
                    
                    if (typeof customer_tonename === "undefined")
                        customer_tonename = 'neutral';
                    if(typeof customer_toneScore === "undefined")
                        customer_toneScore = 0.0;


                    user.tone.en_emotion.current = customer_tonename;
		    user.tone.en_emotion.tonescore = customer_toneScore;
		   
             }
         
});  

	

  return new Promise(function(resolve, reject) {
    toneAnalyzer.tone({
      text: conversationPayload.input.text
    }, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * updateUserTone processes the Tone Analyzer payload to pull out the emotion,
 * language and social tones, and identify the meaningful tones (i.e., those
 * tones that meet the specified thresholds). The conversationPayload json
 * object is updated to include these tones.
 *
 * @param {Json}
 *                conversationPayload json object returned by the Watson
 *                Conversation Service
 * @param {Json}
 *                toneAnalyzerPayload json object returned by the Watson Tone
 *                Analyzer Service
 * @param {boolean}
 *                maintainHistory set history for each user turn in the history
 *                context variable
 * @returns {void}
 */
function updateUserTone(conversationPayload, toneAnalyzerPayload, maintainHistory) {
  var emotionTone = null;
 

  if (!conversationPayload.context) {
    conversationPayload.context = {};
  }

  if (!conversationPayload.context.user) {
    conversationPayload.context.user = initUser();
  }

  // For convenience sake, define a variable for the user object
  var user = conversationPayload.context.user;

  // Extract the tones - emotion, language and social
  if (toneAnalyzerPayload && toneAnalyzerPayload.document_tone) {
    toneAnalyzerPayload.document_tone.tone_categories.forEach(function(toneCategory) {
      if (toneCategory.category_id === EMOTION_TONE_LABEL) {
        emotionTone = toneCategory;
      }
      
    });
    
    updateEmotionTone(user, emotionTone, maintainHistory);
   
  }
  conversationPayload.context.user = user;
  return conversationPayload;
}

/**
 * initToneContext initializes a user object containing tone data (from the
 * Watson Tone Analyzer)
 *
 * @returns {Json} user json object with the emotion, language and social tones.
 *          The current tone identifies the tone for a specific conversation
 *          turn, and the history provides the conversation for all tones up to
 *          the current tone for a conversation instance with a user.
 */
function initUser() {
  return ({
    'tone': {
      'emotion': {
        'current': null
       },
      'en_emotion' : {
         'current' : null,
         'tonescore' :0.0
       },
      'gen_emotion': {
	'Overall_Conversation' : null,
	'Overall_toneScore' : 0.0
       },
      'cus_emotion': {
	'Overall_Conversation' : null,
	'Overall_toneScore' : 0.0
       }
     
    }
    
  });
}

/**
 * updateEmotionTone updates the user emotion tone with the primary emotion -
 * the emotion tone that has a score greater than or equal to the
 * EMOTION_SCORE_THRESHOLD; otherwise primary emotion will be 'neutral'
 *
 * @param {Json}
 *                user a json object representing user information (tone) to be
 *                used in conversing with the Conversation Service
 * @param {Json}
 *                emotionTone a json object containing the emotion tones in the
 *                payload returned by the Tone Analyzer
 * @param {boolean}
 *                maintainHistory set history for each user turn in the history
 *                context variable
 * @returns {void}
 */
function updateEmotionTone(user, emotionTone, maintainHistory) {
  var maxScore = 0.0;
  var primaryEmotion = null;
  var primaryEmotionScore = null;
 

  emotionTone.tones.forEach(function(tone) {
    if (tone.score > maxScore) {
      maxScore = tone.score;
      primaryEmotion = tone.tone_name.toLowerCase();
      primaryEmotionScore = tone.score;
    }
  });

  if (maxScore <= PRIMARY_EMOTION_SCORE_THRESHOLD) {
    primaryEmotion = 'neutral';
    primaryEmotionScore = null;
  }
  // update user emotion tone
  user.tone.emotion.current = primaryEmotion;
  user.tone.emotion.tonescore = maxScore;


}


