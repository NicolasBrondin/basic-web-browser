import { IncomingMessage } from "http";
import { PageResponse } from "../types/PageResponse";

const http = require('http');
const https = require('https');

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
            console.log("[DEBUG] Path - ", this.currentPath);
            return url;
        } else {
            if(url.startsWith("//")){
                return this.getCurrentDomain() + url.substring(1);
            } else if(url.startsWith("/")){
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
        const protocol = this.currentPath.slice(0, this.currentPath.indexOf("//") + 2);
        console.log("[DEBUG] Protocol - ", protocol);
        const noProtocol = this.currentPath.slice(protocol.length);
        console.log("[DEBUG] NoProtocol - ", noProtocol);
        const domain = this.currentPath.slice(0, noProtocol.indexOf("/") > -1 ? (noProtocol.indexOf("/") + protocol.length) : undefined)
        console.log("[DEBUG] Domain - ", domain);
        return domain;
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
            this.currentPath = absoluteLink;
            const method = absoluteLink.startsWith("https://") ? https : http;
            method.get(absoluteLink, (res: IncomingMessage) => {
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