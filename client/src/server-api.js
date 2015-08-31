import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {config} from './config';


@inject(HttpClient)
export class ServerApi {
	constructor(http) {
		this.http = http;
	}

	getTags(user) {
		return this.http.createRequest(config.getTagsURL + '?user=' + user).asGet().send();
	}
	getNotes(user, tag) {
		var params = '?user=' + user;
		if (tag) {
			params += ('&tag=' + tag);
		}
		return this.http.createRequest(config.getNotesURL + params).asGet().send();
	}

	search(user, tag, keywords) {
		if (!keywords || !keywords.length) return;

		var params = '?user=' + user;
		if (tag) {
			params += ('&tag=' + tag);
		}
		params += ('&keywords=' + keywords);

		return this.http.createRequest(config.searchNotesURL + params).asGet().send();
	}

	updateNote(note) {
		return this.http.createRequest(config.saveNoteURL)
			.asPost()
			.withContent(JSON.stringify(note))
			.withHeader('Content-Type', 'application/json')
			.send();
	}

	delete(note) {
		return this.http.createRequest(config.deleteNoteURL)
			.asPost()
			.withContent(JSON.stringify(note))
			.withHeader('Content-Type', 'application/json')
			.send();
	}


}
