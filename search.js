require('dotenv').config()
const express = require('express'),
	app = express(),
	PORT = process.env.port || 5000,
	bodyParser = require('body-parser'),
	path = require('path'),
	axios = require('axios')
	request = require('request')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended :true
}))
app.use(express.static('./public'))
app.get('/',(req,res)=>{
	res.sendFile(path.resolve(__dirname+'/public/project.html'))
})

let logger = (req,res,next) =>{
	next()
}
app.get('/api/image/search',(req,res)=>{
	let value = req.query.search
	request(`https://images-api.nasa.gov/search?q=${value}`,{json:true},(err,resp,body)=>{
		if(err) return res.json({
			error : 1,
			urls : null
		})

		let items = body.collection.items,
			urls = []
		items.forEach(item=>{
			if (item.data[0].media_type == 'image') {
				urls.push(item.links[0].href)
			}
		})

		res.json({
			error : 0,
			urls : urls
		})
	})
})

app.listen(PORT,err =>{
	if(err) return console.log(err)
		console.log(`server running at ${PORT}`)
})