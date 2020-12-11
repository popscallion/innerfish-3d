import Airtable from 'airtable';

const airtableKey = process.env.REACT_APP_AIRTABLE_API_KEY
const baseString = process.env.REACT_APP_AIRTABLE_BASE

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
  const base = new Airtable({apiKey: airtableKey}).base(baseString)
  return new Promise((resolve, reject) => {
    const specimens = []
    base('Specimens').select({
        maxRecords: 35,
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

export const loadAirtable = async () => {
  const data = await loadData()
  const formatted = formatJSON(data)
  return formatted
}
