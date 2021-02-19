const mondayService = require('../services/monday-service');

async function subscribe(req, res) {
  return res.status(200).send({
    webhookId: req.body.payload.subscriptionId,
    result: 'subscribed',
  });
}

async function unsubscribe(req, res) {
  return res.status(200).send({ result: 'unsubscribed' });
}

async function populateTextColumnFromPeopleColumn(req, res) {
  //Retrieves payload data from the frontend as triggered and selected by the user. 
  const { payload } = req.body;
  const { shortLivedToken } = req.session;
  const { inboundFieldValues } = payload;
  const { boardId, itemId, sourceColumnId, targetColumnId } = inboundFieldValues;

  //Retrieves value of user's source column as a JSON value, returns an empty string if no person value, or person value removed from the column. 
  const personValue = await mondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
  if (!personValue) {
    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, JSON.stringify(""));
    return res.status(200).send({});
  };

  //Parses retrieved JSON value to be an object. 
  var parsedPersonValue = JSON.parse(personValue);

  //Declares and populates list of person IDs queried. 
  var personIdsList = []; 
  parsedPersonValue.personsAndTeams.forEach(personObject => {
    personIdsList.push(Number(personObject.id));
  });

  //Declares and populates list of emails queried from person IDs list. 
  var emailList = [];
  for (var email of personIdsList) {
    const userEmail = await mondayService.getUserEmail(shortLivedToken, email);     
    emailList.push(userEmail);
  }
  
  //Formats the email list so that each has a semicolon in between. 
  var joinedEmailList = emailList.join(' ; ');

  //Converts emails to JSON formatting. 
  const finalEmails = JSON.stringify(joinedEmailList);
    //Changes Text Column to house listed emails.
  await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, finalEmails);
  return res.status(200).send({});
}

module.exports = {
  subscribe,
  unsubscribe,
  populateTextColumnFromPeopleColumn,
};
