To run open index.html in a browser
  1.select a to base the encryption off of (this  is done  so all is need to decrypt another latin language is a base file plain.txt )
  2.select a file to decode
  3.once the program is done an option to download the file will appear
  4. now you can select another file to decode


How the Key is found (climb the hill) (for a 1 to 1 encryption)

  1. a random key is generated
  2. this base key is then applied to the first section (10,000 chars)
  3. this "decoded" message is then scored based on quadgrams in the message
  4. then two random characters of the base key are swaped
  5. this new key is then applied to the same section of the origanal message
  6. the new  "decoded" message is then scored based on quadgrams in the message
  7. if the score is higher then the score with the  base key  go back to step 4 with the swaped key becoming the new base key
  8. if the score is lower go back to step 4 without changing the base key
      if it has been 1000 iterations without finding a better score this is most likely the Key!!!

   9. to lower the risk that the key we found is just a local max and not the true key, steps 4-8 are ran again this time testing the second section of code instead of the first.
   (however this is not 100% fool proof if the decoded looks incorrect try running it again  )

  10.   this high scoring Key is the key.

How a message is scored

  1. Once a key has been applied the message is scored based on every quadgram( 4 characters in a row ) in the message.
  2. a quadgram is worth the log of its probability of appearing in english (which was determined by the base file(plain.txt) )
     -if a quadgram was not seen in the basefile it was worth (3/2) times the log(probabtily) of a quadgram that only appeared once in the basefile (keep in mind these values are negative numbers)
     -(READER:BUT WHY LOGS OF THE PROBS )? well if we want to see the probabilty of the word SPORT appearing in the lanague  it would equal p(SPORT)=p(spor) x p(port); and then we would have to score it based on the product of (thousands of scores all on the scale of ~10^-5). But luckily log(A x B)= log(A)+log(B) which means we can put away the super computers and just add some negative numbers to get a  macro score.       
