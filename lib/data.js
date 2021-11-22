
/*
* Fetches data from data.json and puts in localStorage
*/
export async function fetchData() {
  if(window.localStorage.length !== 0) {
    return JSON.parse(window.localStorage.data);
  }

  try {
    const result = await fetch('../data.json');
        
    if (!result.ok) {
      throw new Error('result not ok');
    }
      
    const resultjson = await result.json();
    window.localStorage.setItem('data', JSON.stringify(resultjson));
    
    return resultjson;
        
  } catch (e) {
    console.warn('unable to fetch', e);
    return null;
  }
}

/*
* Updates localStorage
*/
export function updateData() {

}