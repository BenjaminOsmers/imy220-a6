const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const fs = require('fs')

let object = {
	Messages: [],
}

fs.writeFile('messageLog.json', JSON.stringify(object), function (err) {
	if (err) return console.log(err)
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.get('/messages', (req, res) => {
	let messageData = fs.readFileSync('messageLog.json')
	let messages = JSON.parse(messageData)

	let html = '<div class="container"><ul>'

	messages.Messages.forEach((message) => {
		html += `<li>Name: ${message.Name}, Message: ${message.Message}</li>`
	})

	html += `</ul></div>`

	res.send(html)
})

io.on('connection', (socket) => {
	console.log('Connected')

	socket.on('chat message', ({ name, message }) => {
		let obj = { Name: `${name}`, Message: `${message}` }
		let data = JSON.parse(fs.readFileSync('messageLog.json'))
		data.Messages.push(obj)

		fs.writeFile('messageLog.json', JSON.stringify(data), function (err) {
			if (err) throw err
			console.log('succesful write')
		})
	})
})

server.listen(3000, () => {
	console.log(`Server running on port 3000`)
})
