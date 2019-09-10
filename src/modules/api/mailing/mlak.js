let htmlContent = "<a href=\"https://www.google.com/login/855/dgbqe\">3asba</a> <a class=\"test\" href=\"https://www.facebook.com\">3asba2</a> <a id=\"sex\" class=\"mlak\" href=\"https://www.sex.com\">3asba3</a>";
//let links = html.match(/(<a\s+(?:[^>]*?\s+)?href=")([^"]*)(")/ig);
//console.log(links);





    //let endLinkIndex = htmlContent.indexOf("\"", indexesHref[i] + 6);
    //let urlLink = htmlContent.substr(indexesHref[i] + 6, endLinkIndex);


    let regex = /href\s*=\s*(['"])(https?:\/\/.+?)\1/ig;
    let link;
    while((link = regex.exec(htmlContent)) !== null) {

        //let newLink = await this.saveLink(link[2]);
       // message.links.push(newLink._id);                     
        htmlContent.replace(link[2], link[2] + '/' + 'message.uuid' + '/' + 'newLink._id');   
        console.log (link[2])  ;  
        //console.log (htmlContent)  ;  

    }
    
    


