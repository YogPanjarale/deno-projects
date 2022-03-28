import {
	Server,
	Event,
	Client,
	Packet,
} from "https://deno.land/x/tcp_socket@0.0.1/mods.ts";
import { generateName } from "./randomname.ts";

const server = new Server({ port: 5000 });
const clients: Map<string | number, Client> = new Map();

interface Member {
	name: string;
	id: string | number;
}
//chat members
const mem: Map<number, Member> = new Map();
//message history
// const msg: Map<number, string> = new Map();
// Server listen
server.on(Event.listen, (server: Deno.Listener) => {
	const addr = server.addr as Deno.NetAddr;
	console.log(`Server listen ${addr.hostname}:${addr.port}`);
});
// Client connect
server.on(Event.connect, (client: Client) => {
	console.log("New Client -", client.info());
	client.write("Welcome to TCP Socket Server\n");
	const id = client.conn?.rid||0;
	clients.set(id || 0, client);
	const name = generateName(id || 0);
	mem.set(id || 0, {
		name,
		id: id || 0,
	});
	client.write(`Your are ${id}. ${name}\n`);
	client.write("Type '/help' for help\n");
	server.broadcast(`[join] ${id}. ${name} has joined the chat.\n`,client);
});

// Receive packet
server.on(Event.receive, (client: Client, data: Packet, _length: number) => {
	const id = client.conn?.rid || 0;
	console.log(`Receive data from ${id} -`, data.toString());
	const msg = data.toString();
	if (msg.startsWith("/name")) {
		const name = msg.split(" ").splice(1, 1).join(" ");
		if (name) {
			mem.set(id, {
				name,
				id,
			});
			client.write(`[name] Your name is set to ${name}\n`);
		} else {
			const d = mem.get(id);
			client.write(`[name] Your name is ${d?.name}\n`);
		}
	} else if (msg.startsWith("/list")) {
		const list = Array.from(mem.values())
			.map((m) => `${m.id} - ${m.name}`)
			.join("\n");
		client.write(`${list}`);
	} else if (msg.startsWith("/dm")) {
		const target = Number(msg.split(" ")[1]);
		const msg_ = msg.split(" ").slice(2).join(" ");
		const targetClient = clients.get(target);
		if (targetClient) {
			targetClient.write(`[dm] ${target}. ${mem.get(id)?.name} >>> ${msg_}\n`);
		} else {
			client.write(`[err] ${target} is not online \n`);
		}
	}else if (msg.startsWith("/help")) {
		client.write(`/name [name] - change your name\n/list - list online users\n/dm [id] [message] - send a private message to a user\n[] [message] - broadcast message\n`);
	}
	else {
		server.broadcast(`${id}. ${mem.get(id)?.name} > ${msg}\n`);
	}
		
});

// Client close
server.on(Event.close, (client: Client) => {
	const id = client.conn?.rid||0;
	console.log("Client close -", client.info());
	const m = mem.get(id);
	mem.delete(id || 0);
	clients.delete(id || 0);
	server.broadcast(`[leave] ${id}. ${m?.name} has joined the chat.\n`);

});

// Server finish
server.on(Event.shutdown, () => {
	console.log("Server is shutdown");
});

// Handle error
server.on(Event.error, (e) => {
	console.error(e);
});

await server.listen();
server.broadcast("Hello World");
