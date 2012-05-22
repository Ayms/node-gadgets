var http = require('http'),
	request = require('request'),
	dom = require('node-dom').dom,   
	URL = require('url');

var genGadgets = function(query,response){

	var params={}; //url-fetch-proc-gadget-price-search
	
	query.split('&').forEach(function(param){
		var parts = param.split('=');
		params[parts[0].trim()] = (decodeURIComponent(parts[1]) || '').trim();
	});

	if (params.fetch) {params.fetch=JSON.parse(params.fetch);};

	if (params.proc) {params.proc=JSON.parse(params.proc);};

	var ew=0;

	var url = URL.parse(params.url);
	
	var req = {uri:url.href};

	var ini=new Date().valueOf();

	var mdebug=console.log;

	//console.log=function() {};

	request(req,function (error, resp, page) {
	
			if (!error && resp.statusCode == 200) {

			var options =	{	url:url,
								ini: ini,
								features: {
											FetchExternalResources  : params.fetch,
											ProcessExternalResources: params.proc,
											removeScript: true,
											regexp: params.regexp||''
								}
			};

			window=dom(page,null,options);

			document=window.document;

				document.onload=function() {
				
					var tmp=new Date().valueOf()-ini;

					console.log('ewa nb gadgets '+window._ewList.length+' '+tmp);

					var EWA = require('ewa').EWA; //Extract Widget module - not public

					var ewa = new EWA(!!params.gadget,!!params.price,params.search?params.search:false,ew,params.nbmax?params.nbmax:100);

					$b=ewa.$I(document.body);
					
					tmp=new Date().valueOf()-ini;
					
					console.log('before extract '+tmp);

					ewa.extract();

					var head = {'Content-Type': 'text/javascript' };

					tmp=new Date().valueOf()-ini;

					mdebug('Response '+tmp);

					if (response.writeHead) {

						response.writeHead(200, head);

						response.end(params.name+'.gadgets='+JSON.stringify(ewa.__P2)+';');

					} else {
						response.end(ewa.__P2);
					}

				}

			} else {
				if (response.writeHead) {
				
					response.writeHead(200, {'Content-Type': 'text/javascript' });

					response.end(params.name+'.gadgets='+JSON.stringify(['url not found'])+';');

				} else {
					response.end(['url not found']);
				}
			
			};

	});

};

var handleRequest = function (request, response) {

	var qs = URL.parse(request.url);

	if (qs.pathname == '/gengadgets'){
		try {
			genGadgets(qs.query,response);
		} catch(ee) {
			response.end('Bad formatted request');
		};
	};
};

var launchServer = function(port) {
	http.createServer(handleRequest).listen(port);
};

exports.launchServer = launchServer;
exports.genGadgets = genGadgets;