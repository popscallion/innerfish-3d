const Airtable = require('airtable');
const functions = require('firebase-functions');



exports.loadAirtable = functions.https.onCall((request, response) => {
    const base = new Airtable({apiKey: functions.config().airtable.key}).base(functions.config().airtable.base)
    return new Promise((resolve, reject) => {
      const specimens = []
      base('Specimens').select({
          fields: [
            'Scientific Name',
            'Other Name',
            'UID',
            'Link',
            'Type',
            'Showstopper',
            'Default',
            'Group',
            'Chapter',
            'Week',
            'Section',
            'SectionIndex',
            'Caption'
          ],
          view: "Grid view"
      }).eachPage(function page(records, fetchNextPage) {
          records.forEach(function(record) {
              specimens.push(record.fields)
          });
          fetchNextPage();
      }, function done(err) {
          if (err) {
                reject(err);
              } else {
                resolve(specimens);
              }
      })
    })
});
