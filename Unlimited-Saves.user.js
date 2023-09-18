// ==UserScript==
// @name Unlimited Saves
// @description Allows for an unlimited amount of saves on Pixlr.com
// @version 2.0.0
// @icon https://repository-images.githubusercontent.com/691387917/16f4c271-27e2-4e73-8cca-edc98d40304e
// @updateURL https://raw.githubusercontent.com/Oshanotter/Unlimited-Saves/main/Unlimited-Saves.user.js
// @namespace Oshanotter
// @author Max Forst
// @include https://pixlr.com/e/*
// @run-at document-start
// ==/UserScript==


// thanks to Hakorr over on GitHub for the following code!
// https://github.com/Hakorr/Userscripts/blob/main/Pixlr.com/UnlimitedSaves/unlimitedsaves.user.js
// I want to awknoledge that parts of this userscript are not my own code, but I wanted to impliment it with my own userscript.

function main(){


  (() => {
      const replacementRegex = /\(\)\s*>=\s*3/g;
      const bypassStr = `()=='D'`;

      function patchNode(node) {
          node?.remove();

          fetch(node.src)
              .then(res => res.text())
              .then(text => {
                  text = text.replace(replacementRegex, bypassStr);

                  if(!text.includes(bypassStr)) {
                      console.log(`Daily limit bypass failed, the userscript may be outdated! Trying different approach`);
                      backupCode();
                  }

                  const newNode = document.createElement('script');
                        newNode.innerHTML = text;

                  document.body.appendChild(newNode);
              });
      }

      new MutationObserver(mutationsList => {
          mutationsList.forEach(mutationRecord => {
            [...mutationRecord.addedNodes]
              .filter(node => node.tagName === 'SCRIPT' && node.src?.includes('/dist/'))
              .forEach(node => patchNode(node));
          });
      }).observe(document, { childList: true, subtree: true });
  })();


}



// if the code above stops working, try the code below

function backupCode(){

  // clear the local storage in order to reset the image download count; a page reload is needed
  // also set the scroll settings back the way I like it
  function clear(){
    localStorage.clear()
    document.querySelector("#settings-scroll-mode > option:nth-child(2)").selected = true
  }

  setTimeout(clear, 500);


  // continuously monitor for when Pixlr will no longer let you download more images, then reload the page
  function monitor(){
    const repeat = setInterval(function()
    {

      try{
        //localStorage.clear()
        //document.querySelector("#settings-scroll-mode > option:nth-child(2)").selected = true
        var popUp = document.querySelector("#do-login")

        if (typeof popUp != "undefined"){
          var dis = popUp.style.display
          var clickedOK = confirm("Reload the page to download more images.\n(You might have to do this twice)\nClick 'OK' to reload")
          if (clickedOK){
            window.location.reload();
          }
          clearInterval(repeat)
        }
      }
      catch{
        console.log("try again")
      }

    }, 100);
  }

  setTimeout(monitor, 1000);

}

main()
