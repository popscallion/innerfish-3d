const Airtable = require('airtable');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const formatJSON = (data) => {
  const formatted = []
  const template = {
    "uid": "",
    "url": "",
    "scientific": "",
    "common": "",
    "group": "",
    "chapter": [],
    "showstopper": false,
    "default": false,
    "week": [],
    "type": "",
    "section": "",
    "sectionIndex": "",
    "caption": "",
  }
  for (let datum of data) {
    const newDatum = {
      "uid": datum['UID'] ? datum['UID'] : template['UID'],
      "url": datum['Link'] ? datum['Link'] : template['url'],
      "scientific": datum['Scientific Name'] ? datum['Scientific Name'] : template['scientific'],
      "common": datum['Other Name'] ? datum['Other Name'] : template['common'],
      "group": datum['Group'] ? datum['Group'] : template['group'],
      "chapter": datum['Chapter'] ? datum['Chapter'] : template['chapter'],
      "showstopper": datum['Showstopper'] ? datum['Showstopper'] : template['showstopper'],
      "default": datum['Default'] ? datum['Default'] : template['default'],
      "week": datum['Week'] ? datum['Week'] : template['week'],
      "type": datum['Type'] ? datum['Type'] : template['type'],
      "section": datum['Section'] ? datum['Section'] : template['section'],
      "sectionIndex": datum['SectionIndex'] ? datum['SectionIndex'] : template['sectionIndex'],
      "caption": datum['Caption'] ? datum['Caption'] : template['caption'],
    }
    formatted.push(newDatum)
  }
  return formatted
}

const loadData = () => {
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
}

//
// exports.loadAirtable = functions.https.onRequest(async (req, res) => {
//   cors(req, res, () => {})
//   res.set("Access-Control-Allow-Origin", "*");
//   res.set("Access-Control-Allow-Methods", "GET");
//   res.set("Access-Control-Allow-Headers", "Content-Type");
//   res.set("Access-Control-Max-Age", "3600");
//   const fetched = await loadData()
//   const formatted = formatJSON(fetched)
//   return res.status(200).send(formatted)
// })


exports.loadAirtable = functions.https.onCall(async (dat) => {
  const fetched = await loadData()
  const formatted = formatJSON(fetched)
  return formatted
})
