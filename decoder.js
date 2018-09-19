function numberofchar(str, letter) {
  var reg= new RegExp(letter,"gi")
  return (str.match(reg) ||[]).length;

}
document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
document.getElementById('basefile').addEventListener('change', readbaseFile, false);
var scorecard; var zeroscore=0;
 function readbaseFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        makescorecard(contents);


      }
       r.readAsText(f);
    } else {
      alert("Failed to load file");
    }
  }

function readSingleFile(evt) {
   //Retrieve the first (and only!) File from the FileList object
   var f = evt.target.files[0];

   if (f) {
     var r = new FileReader();
     r.onload = function(e) {
       var contents = e.target.result;
       decoder(contents)


     }
      r.readAsText(f);
   } else {
     alert("Failed to load file");
   }
 }



function decoder(contents)
{
  var encry={};
  var initswaps=1000;
  var alpha="abcdefghijklmnopqrstuvwxyz";

  var alphabet="etoaisnrhldumywcfgbpvkxjqz";  // order of frequency in input
  encry.str=contents.slice(1,10000); /* the incoded message */
  console.log(encry.str.length);
  encry.freq=[]; /* count number of char in message */
  encry.key={};
  for (var i in alpha) {
    var c=alpha.charAt(i);
    encry.key[c]=c; /* building array key */
    encry.freq.push([c,numberofchar(encry.str, c)]);
  }
  // encry.freq.sort(function(a,b){
  //     return a[1]-b[1];
  // });
  // for (var i = 0; i < alphabet.length; i++) {
  //   var c=encry.freq.pop()[0];
  //   encry.key[c]=alphabet[i];
  // }

  console.log(encry.key);

  //create random strating key
  for (var i = 0; i < initswaps; i++) {
    encry.key=swapkeys(encry.key);
  }

  encry.finalstr=applyKey(encry.str,encry.key);
  encry.score=score(encry.finalstr);
  var runs=0;
  //climb the hill
  while(runs<1000)
  {
    runs++;
    // var timer=new Date();
    // var time1=timer.getMilliseconds();
    encry.testkey=swapkeys(encry.key);
    // console.log(encry.testkey);
    // console.log(encry.key)
    // break;
    // var time2=timer.getMilliseconds();
    // console.log(time2);
    encry.teststr=applyKey(encry.str,encry.testkey);
    // var time3=timer.getMilliseconds();
    // console.log(time3);
    encry.testscore=score(encry.teststr);
    // var time4=timer.getMilliseconds();
    // console.log(time4);
    //break;
    if(encry.testscore>encry.score) //with better score rests run
    {
      encry.key=Object.assign({},encry.testkey);
      encry.finalstr=encry.teststr;
      encry.score=encry.testscore;
      runs=0;
      console.log(encry.testscore);

    }
  }











  console.log(Object.entries(encry.key).sort(function(a,b){
      return a[1].localeCompare(b[1]);
  }));


}
/* name: score()
  purpose: grades the swaped str based on
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
  str=str.replace(/\W/g,'');
  str=str.toLowerCase();
  var quadgram=(str.match(/[A-Z|a-z]{4}/g)).concat(str.slice(1).match(/[A-Z|a-z]{4}/g),str.slice(2).match(/[A-Z|a-z]{4}/g),str.slice(3).match(/[A-Z|a-z]{4}/g)); //finds all of the quadgram in the text and makes an array
  var l= Math.log(quadgram.length); //log of the total number of quadgrams
   scorecard =quadgram.reduce(function(prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {}); // reduces the quadgram array into the form {xxxx: <numtimesxxx>, yyyy: <numtimesyyyy>,... }

  for (var i in scorecard) {
    scorecard[i]=Math.floor( Math.log(scorecard[i])-l); //this will give the log probabtily for every quadgram
  }

  zeroscore=Math.floor((-l)*3/2); //assign a zero quadgram to 3/2 times as low as a 1 count


  console.log(scorecard);

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
 //console.log(swap);
  var newkey=Object.assign({},key)
  var x=alpha[num1]; var y=alpha[num2];
  newkey[x]=key[y];
  newkey[y]=key[x];


  return newkey;
}
