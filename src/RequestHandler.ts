import { IncomingMessage } from "http";
import { PageResponse } from "../types/PageResponse";

const http = require('http');

export class RequestHandler {
    history: string[] = [];
    currentPath?: string;
    constructor() {
    }

    parseAbsoluteUrl(url: string) : string {
        if(!url)
            throw new Error("Url is null");
        if(this.isUrlAbsolute(url)){
            this.currentPath = this.getCurrentPathFromUrl(url);
            return url;
        } else {
            if(url.startsWith("/")){
                return this.getCurrentDomain() + url;
            } else {
                return this.currentPath + "/" + url;
            }
        }
        /*this.domain = /https?:\/\/([^\/]+)/.exec(url)?.[1];
        let absoluteLink = url;
        
        if(url.startsWith("/")){
            if(this.domain == null){
                throw new Error("Domain is null");
            }
            return this.domain + absoluteLink;
        }
        return absoluteLink;*/

    }

    getHistory(){
        return this.history;
    }

    getCurrentDomain(){
        if(!this.currentPath){
            return null;
        }
        const index = this.currentPath.indexOf("/");
        return this.currentPath.slice(0, index);
    }

    getCurrentPathFromUrl(url: string){
        const index = url.lastIndexOf("/");
        return url.slice(0, index);
    }

    isUrlAbsolute(url: string){
        return url.startsWith("http://") || url.startsWith("https://");
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