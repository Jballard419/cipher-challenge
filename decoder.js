//Add funictions to event addEventListeners
document.getElementById('fileinput').addEventListener('change', readFile, false);
document.getElementById('basefile').addEventListener('change', readbaseFile, false);
//globals to pass between the different funiction
var scorecard; var zeroscore=0; var answer;

/*
  name: readbaseFile()
  purpose: handles reading the base file,passing the contents to scorecard(), and dealing with the DOM
*/
  function readbaseFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        makescorecard(contents);

        document.getElementById("part1").style.display="none"
        document.getElementById("part2").style.display="inline";
      }
       r.readAsText(f);
    } else {
      alert("Failed to load file");
    }
  }
/*
  name: readFile()
  purpose: handles the file to be encoded being submited and passinng  it to the Decoder(), also handles setting the Dom for user info

*/
function readFile(evt) {
   //Retrieve the first (and only!) File from the FileList object
   var files = evt.target.files;
   for (var i = 0, f; f = files[i]; i++) {
     if (f) {
       var r = new FileReader();
       r.onload = function(e) {
         var contents = e.target.result;
         document.getElementById("part2").style.display="none"

         decoder(contents)
         document.getElementById("part3").style.display="inline";

       }
        r.readAsText(f);
     } else {
       alert("Failed to load file");
     }
 }
 }
 /* name: saveTextAsFile()
    purpose: save the encoded file and changes the DOM back to state 2 so another file can be decrpyted
*/
 function saveTextAsFile()
{

   var textToSaveAsBlob = new Blob([answer], {type:"text/plain"});
   var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
   var fileNameToSaveAs = document.getElementById("saveAS").value;
   var downloadLink = document.createElement("a");
   downloadLink.download = fileNameToSaveAs;
   downloadLink.innerHTML = "Download File";
   downloadLink.href = textToSaveAsURL;
   downloadLink.onclick = destroyClickedElement;
   downloadLink.style.display = "none";
   document.body.appendChild(downloadLink);
   downloadLink.click();
   document.getElementById("part2").style.display="inline"
   document.getElementById("part3").style.display="none";
}
/*
  name:destroyClickedElement(event)
  purpose: a helper funiction to clean up the download link when clicked
*/
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
/*
  name: decoder()
  purpose: the 'main()' of the decrpytion deals setting up the contents for deriveKey()  and evuantly saving the decoded message
  pre: the contents
  post: the final message is loaded in to the global var answer

*/

function decoder(contents)
{
  var encry={};
  var initswaps=1000;
  var alpha="abcdefghijklmnopqrstuvwxyz";


  encry.str=contents.slice(0,10000); /* the first 1000 incoded message */


  encry.key={};
  for (var i in alpha) {
    var c=alpha.charAt(i);
    encry.key[c]=c; /* building array key */

  }



  

  //create random starting key
  for (var i = 0; i < initswaps; i++) {
    encry.key=swapkeys(encry.key);
  }

  encry=deriveKey(encry);

  encry.str=contents.slice(10000,20000)
  encry=deriveKey(encry); //  checks to confrim  the key wasn't a local max found by trying on a different section of the message

  answer=applyKey(contents,encry.key);
  return;


}

/*
  name: derivekey
  purpose: derives the key using a climb the hill apoarch
  pre: the encry object
  post: the encry object with new key.
*/
function deriveKey(encry){

encry.teststr=applyKey(encry.str,encry.key);
encry.score=score(encry.teststr);
var runs=0;
//climb the hill
while(runs<1000)
{
  runs++;

  encry.testkey=swapkeys(encry.key); //swap two elements of the key

  encry.teststr=applyKey(encry.str,encry.testkey);

  encry.testscore=score(encry.teststr);

  if(encry.testscore>encry.score) //if the score is higher we will select it as the new key procced to find a better soln from it
  {
    encry.key=Object.assign({},encry.testkey);
    encry.finalstr=encry.teststr;
    encry.score=encry.testscore;
    runs=0;
    //console.log(encry.testscore);

  }
}
return encry;
}
/* name: score()
  purpose: grades the decrpyted str based on the pretrime scorecard
  pre: str and the key to be added
  post: newstr

*/
function score(str) {
  str=str.replace(/\W/g,'');
  str=str.toLowerCase();
  var score=0;
  var quadgram=(str.match(/[A-Z|a-z]{4}/g)).concat(str.slice(1).match(/[A-Z|a-z]{4}/g),str.slice(2).match(/[A-Z|a-z]{4}/g),str.slice(3).match(/[A-Z|a-z]{4}/g));

  for (var i = 0; i < quadgram.length; i++) {
    var temp=scorecard[quadgram[i]];

    score=(temp||zeroscore)+score;
  };
  return score;
}
/* name: applyKey
  purpose: creates new string with key
  pre: str and the key to be added
  post: newstr

*/
function applyKey (str,key)
{
  var newstr="";

  for (var i in str) {
    var c=str.charAt(i);

    if(c.search(/[A-Z]/g)==0)
    {
      c=c.toLowerCase();
      newstr=newstr+key[c].toUpperCase();

    }else if (c.search(/[a-z]/g)==0) {
      newstr=newstr+key[c];

    }else {
      newstr=newstr+c //non- letters
    }

  }
  return newstr;

}


/*
  name:makescorecard
  Purpose: creates scorecard  from basetext
  pre: contents of basetext.
  post:scorcard
*/
function makescorecard(contents)
{
  var str=contents
  str=str.replace(/\W/g,''); // removes none letters
  str=str.toLowerCase();

  // this makes an array with every quadgram in the file
  var quadgram=(str.match(/[A-Z|a-z]{4}/g)).concat(str.slice(1).match(/[A-Z|a-z]{4}/g),str.slice(2).match(/[A-Z|a-z]{4}/g),str.slice(3).match(/[A-Z|a-z]{4}/g)); //finds all of the quadgram in the text and makes an array
  var l= Math.log(quadgram.length); //log of the total number of quadgrams
   scorecard =quadgram.reduce(function(prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {}); // reduces the quadgram array into the form {xxxx: <numtimesxxx>, yyyy: <numtimesyyyy>,... }

  for (var i in scorecard) {
    scorecard[i]=Math.floor( Math.log(scorecard[i])-l); //this will give the log probabtily for every quadgram
    // it was done this way instead of log(scorecard[i]/length) as it the log funiction runs quicker when
  }

  zeroscore=Math.floor((-l)*3/2); //assign a zero quadgram to 3/2 times as low as a 1 count


}
// purpose: give a randomint between 0 and num-1
function randomint(num){ return Math.floor(Math.random()*num);}

/*
  name: swapkeys,
  purpose: swap two charctars of the Key
  input:key
  output:new key
*/
function swapkeys(key) {


  var alpha="abcdefghijklmnopqrstuvwxyz";
  var num1=randomint(26); //index to swap
  do {
    var num2=randomint(26); //index to swap
  } while (num1===num2);

 // var swap={(alpha[num1]):key[alpha[num2]], {alpha[num2]:key[alpha[num1]] }

  var newkey=Object.assign({},key)
  var x=alpha[num1]; var y=alpha[num2];
  newkey[x]=key[y];
  newkey[y]=key[x];


  return newkey;
}
