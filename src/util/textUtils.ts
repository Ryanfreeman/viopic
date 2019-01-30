//Create text array
export const createStrArray = (text: String) => {
  let str = text;
  if (!str || str === '')
    return '';

  let res = str.split(/[ ]/);    
  return res;
}

//verify if the text is an URL
export const isURL = (text) => {    
  var pattern = new RegExp('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'); // fragment locater
  if(!pattern.test(text)) {      
    return false;
  } else {
    return true;
  }
}

