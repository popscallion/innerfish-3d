import firebase from '../firebaseInit'

const firebaseAirtable = firebase.functions().httpsCallable('loadAirtable')

export const loadAirtable = async () => {
  const data = await firebaseAirtable(null)
  return data.data
}
