// The PayloadPanel module is designed to handle
// all display and behaviors of the payload column of the app.
/* eslint no-unused-vars: "off" */
/* global Api: true, Common: true, PayloadPanel: true*/

var PayloadPanel = (function() {
  var settings = {
    selectors: {
      payloadColumn: '#payload-column',
      payloadInitial: '#payload-initial-message',
      payloadRequest: '#payload-request',
      payloadResponse: '#payload-response'
    },
    payloadTypes: {
      request: 'request',
      response: 'response'
    }
  };

  // Publicly accessible methods defined
  return {
    init: init,
    togglePanel: togglePanel
  };

  // Initialize the module
  function init() {
    payloadUpdateSetup();
  }

  // Toggle panel between being:
  // reduced width (default for large resolution apps)
  // hidden (default for small/mobile resolution apps)
  // full width (regardless of screen size)
  function togglePanel(event, element) {
    var payloadColumn = document
      .querySelector(settings.selectors.payloadColumn);
    if (element.classList.contains('full')) {
      element.classList.remove('full');
      payloadColumn.classList.remove('full');
    } else {
      element.classList.add('full');
      payloadColumn.classList.add('full');
    }
  }

  // Set up callbacks on payload setters in Api module
  // This causes the displayPayload function to be called when messages are sent
  // / received
  function payloadUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function(newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
      // displayPayload(settings.payloadTypes.request);
    };

    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function(newPayload) {
      currentResponsePayloadSetter.call(Api, newPayload);
      displayPayload(settings.payloadTypes.response);
    };
  }

  // Display a request or response payload that has just been sent/received
  function displayPayload(typeValue) {
    var isRequest = checkRequestType(typeValue);
    if (isRequest !== null) {
      // Create new payload DOM element
      var payloadDiv = buildPayloadDomElement(isRequest);
      var payloadElement = document
        .querySelector(isRequest ? settings.selectors.payloadRequest
          : settings.selectors.payloadResponse);
      // Clear out payload holder element
      while (payloadElement.lastChild) {
        payloadElement.removeChild(payloadElement.lastChild);
      }
      // Add new payload element
      payloadElement.appendChild(payloadDiv);
      // Set the horizontal rule to show (if request and response payloads both
      // exist)
      // or to hide (otherwise)
      var payloadInitial = document
        .querySelector(settings.selectors.payloadInitial);
      if (Api.getRequestPayload() || Api.getResponsePayload()) {
        payloadInitial.classList.add('hide');
      }
    }
  }

  // Checks if the given typeValue matches with the request "name", the response
  // "name", or neither
  // Returns true if request, false if response, and null if neither
  // Used to keep track of what type of payload we're currently working with
  function checkRequestType(typeValue) {
    if (typeValue === settings.payloadTypes.request) {
      return true;
    } else if (typeValue === settings.payloadTypes.response) {
      return false;
    }
    return null;
  }

  // Constructs new DOM element to use in displaying the payload
  function buildPayloadDomElement(isRequest) {
    var payloadPrettyString = jsonPrettyPrint(isRequest ? Api
      .getRequestPayload() : Api.getResponsePayload());

    var payloadJson = {
      'tagName': 'div',
      'children': [
       
        {
          // <div class='code-line responsive-columns-wrapper'>
          'tagName': 'div',
          'classNames': [ 'code-line', 'responsive-columns-wrapper' ],
          'children': [
            {
              // <div class='line-numbers'>
              'tagName': 'pre',
              'text': createLineNumberString((payloadPrettyString
                .match(/\n/g) || []).length + 1),
              'classNames': [ 'line-numbers' ]
            }, {
              // <div class='payload-text responsive-column'>
              'tagName': 'pre',
              'classNames': [ 'payload-text', 'responsive-column' ],
              'html': payloadPrettyString
            } ]
        } ]
    };

    return Common.buildDomElement(payloadJson);
  }

  // Format (payload) JSON to make it more readable
  function jsonPrettyPrint(json) {
    if (json === null) {
      return '';
    }
    var ke = json.context.user.tone.emotion ; 
    var ge = json.context.user.tone.gen_emotion;
    var je = json.context.user.tone.cus_emotion;
    var pe = json.context.user.tone.en_emotion;


    if (ke.tonescore >= pe.tonescore){
        var ue = {'Current User Message Tone' : ke};
      }
    else{
        var ue = {'Current User Message Tone' : pe};
      }
   


    if (ge.Overall_toneScore >= je.Overall_toneScore){
        if(ge.Overall_toneScore <= 0.2){
           ge.Overall_Conversation = 'neutral';
         }
        var ue1 = {'User Chat History Tone' : ge };
      }
    else{
         if(je.Overall_toneScore <= 0.2){
           je.Overall_Conversation = 'neutral';
         }
        var ue1 = {'User Chat History Tone' : je }; 
      }
     
    //console.log(ke); 
    var le = Object.assign(ue,ue1);
    //console.log(pe);
    if (ke.current != "sadness" && ke.tonescore != 0.916667){
    var convert = JSON.stringify(le, null, 2);

    convert = convert.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(
      />/g, '&gt;');
    convert = convert
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, // eslint-disable-line no-useless-escape
        function(match) {
          
          
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
    //console.log(convert);
    return convert;
  }
}

  // Used to generate a string of consecutive numbers separated by new lines
  // - used as line numbers for displayed JSON
  function createLineNumberString(numberOfLines) {
    var lineString = '';
    var prefix = '';
    for (var i = 1; i <= numberOfLines; i++) {
      lineString += prefix;
      
      lineString += i;
      
      prefix = '\n';
    }
    return lineString;
  }
}());