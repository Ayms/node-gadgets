node-gadgets
===

Node.js implementation of Extract Widget using https://github.com/Nais/node-dom/

## Purpose:

Real-time extraction of HTML gadgets and associated properties from web pages based on given criterias.

It can be used as a server or an API, then parameters are passed in the URL, or directly as an independant node.js module.

## Install :

    npm install node-gadgets

or

    git clone http://github.com/Nais/node-gadgets.git
    cd node-gadgets
    npm link .
	
Complementary modules :
	 node-ewa
	 
	 Note : node-ewa is not a public module for now, so you can only use node-gadgets's server/API mode. 

## Use :

	gengadgets.js :
	
### As a module :
	
````
	var genGadgets = require('node-gadgets').genGadgets;
	
	var $E=encodeURIComponent;
	
	var response={
		end:function(gadgets) {
			console.log(gadgets);
			//output format, see below
		}
	};
	
	var params='url=http://www.google.com'+'&name=test';
	params +='&fetch='+$E('{"img":"", "input":""}')+'&proc='+$E('{"img":"","input":""}')+'&gadget=true&price=true&regexp='+$E(\\$|€')&search='+$E('Koncept californie');

    //possible params (see below) : url-fetch-proc-gadget-price-search-regexp

	genGadgets(params,response);
````
### As a server/API :
	
````
	var http = require('http'),  
	URL = require('url'),
	genGadgets = require('node-gadgets').genGadgets;

	var handleRequest = function (request, response) {
	  
		var qs = URL.parse(request.url);
		  
		if (qs.pathname == '/gengadgets'){
			genGadgets(qs.query,response);
		};
	};

	http.createServer(handleRequest).listen(myport);
````
To call it directly :

http://myserver:myport/gengadgets?url=http://www.castorama.fr/store/Parquet-et-stratifie-cat_id_3144.htm&name=page&fetch={"img":"", "input":""}&proc={"img":"","input":""}&gadget=true&price=true&regexp=\$|€

Example with encoded parameters :
http://213.246.53.127:1341/gengadgets?url=http%3A%2F%2Fwww.castorama.fr%2Fstore%2FParquet-et-stratifie-cat_id_3144.htm&name=page&fetch=%7B%22img%22%3A%22%22%2C%20%22input%22%3A%22%22%7D&proc=%7B%22img%22%3A%22%22%2C%20%22input%22%3A%22%22%7D&gadget=true&price=true&regexp=%5C%24%7C%E2%82%AC

To call it from a script :

````
	var xscript=document.createElement('SCRIPT');
	xscript.type="text/javascript";
	var params='url=http://www.target_site.com'+'&name=test';
	params +='&fetch='+$E('{"img":"", "input":""}')+'&proc='+$E('{"img":"","input":""}')+'&gadget=true&price=true&regexp='+$E('\\$|€');
	xscript.src='http://myserver:myport/gengadgets?'+params;
	document.head.appendChild(xscript);

	xscript.onload or onreadystatechange --> do what you have to do with the output
````
Output format (see more details below) : test.gadgets=(Array containing the gadgets) (where 'test' does correspond to the parameter 'name')

Example : xscript.onload=function() {alert(test.gadgets)};

	Note : if your regexp does contain "\" and if you pass it through a js var (Example above : $E('\\$|€')) make sure to double it.
	
	Note2 : make sure the encoding of your files/browsers is utf-8

## Parameters :

url : the url of the site where you want to extract gadgets from.

name : the name that will become the name of the global var containing the output in its 'gadgets' property (example : test.gadgets).

fetch : node-dom FetchExternalResources parameter, recommended value : {"img":"", "input":""}

proc : node-dom ProcessExternalResources parameter, recommended value : {"img":"", "input":""}

regexp : while building the DOM, node-dom will use that regular expression to detect the objects that you are looking for (example : regexp=\$|€ --> you are looking for gadgets in the page that are related to a price in $ or €)

gadget : if present, indicates that you want the HTML of the gadget to be in the output

price : if present, indicates that you want the price (if any) associated to the gadget to be present in the output

search : if present, indicates that once the gadgets have been selected with the regexp, you can filter these gadgets based on the value of search (example : you have selected on a sport web sites gadgets related to a price, you want in the output only gadgets related to shoes, then you might use search=shoe)

## Output :

The output is an Array of :

[gadget html,width,height,gadget name,reserved,base,price,html of regexp object]

No json format here for now for historical reasons and backward compatibility with existing projects (TODO later).

gadget html : the html of the gadget.

width and height : width/height of the gadget

gadget name : the name that node-gadgets has processed for the gadget (example : Nike Sportswear Shox Rivalry Baskets Basses 115$)

base : the baseURI of the target web site (must be added as a BASE tag when using gadget's html to reconstruct it)

price : the price associated to the gadget if it exists (example : 115$ for our example above)

html of regexp object : html of the initial object detected with the regexp from which the gadget has been constructed (example : a price, then node gadget will see if a gadget can be constructed from this price looking at his parents and checking if the result can be considered as a product)
	
## Tests and API :

Webble project : http://www.webble.it/mindex5.php

jCore server : http://213.246.53.127:1341/gengadgets?params

You can use the API on jCore server : http://213.246.53.127:1341 (if by any unforeseen reasons the server is down, please advise).

See tests.txt in ./test

