var http=require('http');
var fs=require('fs');
var url=require('url');
var port=process.argv[2];
var server=http.createServer(function(request,response){
	var path=request.url;
	var oUrl=url.parse(path,true);
	var pathStr=oUrl.pathname;
	var queryStr='';
	var paramArr=[];
	if(path.indexOf('?')>=0){
		queryStr=path.substring(path.indexOf('?')+1);
		paramArr=queryStr.split('=');
	}
	/********************************************/
	if(pathStr==='/pay' && queryStr){
		response.setHeader('Content-Type','application/javascript');
		if(paramArr[0]==='callback'){
			var aNum=fs.readFileSync('./db','utf-8');
			aNum=aNum-1+'';
			response.write(`${paramArr[1]}.call(undefined,'success')`);
			fs.writeFileSync('./db',aNum,'utf-8');
		}else{
			response.statusCode=400;
		}
		response.end();
	}else if(pathStr==='/frank.html'){
		var str=fs.readFileSync('./frank.html','utf-8');
		var num=fs.readFileSync('./db','utf-8');
		str=str.replace('&&&num&&&',num);
		response.setHeader('Content-Type','text/html;charset=utf-8');
		response.write(str);
		response.end();
	}else{
		response.statusCode=404;
		response.end();
	}

});
server.listen(port);
console.log('服务器已开启...');