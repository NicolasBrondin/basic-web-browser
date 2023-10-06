import { IncomingMessage } from "http";
import { PageResponse } from "../types/PageResponse";

const http = require('http');

export class RequestHandler {
    domain?: string;

    constructor() {
    }

    parseAbsoluteUrl(url: string) : string {
        if(!url)
            throw new Error("Url is null");
        this.domain = /https?:\/\/([^\/]+)/.exec(url)?.[1];
        let absoluteLink = url;
        
        if(url.startsWith("/")){
            if(this.domain == null){
                throw new Error("Domain is null");
            }
            return this.domain + absoluteLink;
        }
        return absoluteLink;
    }

    requestUrl(url: string) : Promise<PageResponse>{
        return new Promise((resolve, reject) => {

            const absoluteLink = this.parseAbsoluteUrl(url);
            console.log("[REQUEST]"+absoluteLink);

            http.get(absoluteLink, (res: IncomingMessage) => {
                let data = '';
                res.on('data', (chunk: string) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve({
                        url: absoluteLink,
                        content: data
                    });
                });
            });
        });
    }
}